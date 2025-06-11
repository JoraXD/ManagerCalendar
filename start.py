#!/usr/bin/env python3
"""
Startup script for Tour Guide Manager
Runs both Python FastAPI backend and React frontend
"""
import os
import subprocess
import sys
import time
import threading

def start_backend():
    """Start the Python FastAPI backend"""
    print("Starting Python FastAPI backend...")
    os.chdir('backend')
    try:
        subprocess.run([sys.executable, 'main_simple.py'])
    except KeyboardInterrupt:
        print("Backend stopped")

def start_frontend():
    """Start the React frontend development server"""
    print("Starting React frontend...")
    time.sleep(2)  # Give backend time to start
    os.chdir('../frontend')
    try:
        subprocess.run(['npm', 'run', 'dev'])
    except KeyboardInterrupt:
        print("Frontend stopped")

if __name__ == "__main__":
    # Start backend in a separate thread
    backend_thread = threading.Thread(target=start_backend)
    backend_thread.daemon = True
    backend_thread.start()
    
    # Start frontend in main thread
    start_frontend()