#!/usr/bin/env bash
# Parallel miner orchestrator for rpow2 with Status Dashboard.
# Launches multiple instances of the Rust CLI miner and shows their status in real-time.

set -e

NUM_PROCS=${1:-4}
CORES_PER_PROC=${2:-1}
BASE_URL=${3:-${RPOW_BASE_URL:-http://localhost:8080}}

# Ensure the CLI is built
echo "Checking CLI build..."
cargo build --release -p rpow-cli

CLI_PATH="./target/release/rpow"
LOG_DIR=$(mktemp -d -t rpow-miner-logs-XXXX)
PIDS=()

cleanup() {
    echo -e "\n\nShutting down processes..."
    for pid in "${PIDS[@]}"; do
        kill "$pid" 2>/dev/null || true
    done
    rm -rf "$LOG_DIR"
    echo "Done."
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "Starting $NUM_PROCS mining processes ($CORES_PER_PROC core(s) each) against $BASE_URL..."
echo "Logs are being written to $LOG_DIR"
echo "--------------------------------------------------------------------------------"

for i in $(seq 1 "$NUM_PROCS"); do
    # Run in background, redirect both stdout and stderr to a per-process log
    $CLI_PATH --base-url "$BASE_URL" mine --cores "$CORES_PER_PROC" > "$LOG_DIR/miner-$i.log" 2>&1 &
    PIDS+=($!)
    echo "  [Launched] Miner $i (PID: $!)"
done

# Give them a moment to start
sleep 1

echo -e "\nDashboard (Press Ctrl+C to stop):"
# Pre-allocate lines for the dashboard
for i in $(seq 1 "$NUM_PROCS"); do echo ""; done

while true; do
    # Move cursor up to the start of the dashboard
    tput cuu "$NUM_PROCS"
    
    for i in $(seq 1 "$NUM_PROCS"); do
        # Clear current line
        tput el
        
        if ! kill -0 "${PIDS[$((i-1))]}" 2>/dev/null; then
            echo -e "\033[31mMiner $i [DEAD]\033[0) (Check $LOG_DIR/miner-$i.log)"
        else
            # Get the last line of the log, trim it to terminal width
            STATUS=$(tail -n 1 "$LOG_DIR/miner-$i.log" 2>/dev/null || echo "Starting...")
            # Simple color for 'minted' lines
            if [[ "$STATUS" == *"minted token"* ]]; then
                echo -e "\033[32mMiner $i: $STATUS\033[0m"
            else
                echo "Miner $i: $STATUS"
            fi
        fi
    done
    
    sleep 1
    
    # Check if all died
    ALIVE=0
    for pid in "${PIDS[@]}"; do
        if kill -0 "$pid" 2>/dev/null; then ALIVE=$((ALIVE+1)); fi
    done
    if [ $ALIVE -eq 0 ]; then
        echo "All miners have stopped."
        cleanup
    fi
done
