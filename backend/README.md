# Backend Setup and Launch Guide

This document explains how to set up and run the Flask-based backend for the React Native application. Follow the steps below.

## Prerequisites

Before proceeding, ensure you have the following:

1. **Miniconda (If you have already installed Miniconda skip this step)**

   * **Download**: Go to the [Miniconda](https://docs.conda.io/en/latest/miniconda.html) website and download the installer for your operating system.
   * **Install on Windows**:

     1. Run the downloaded `.exe` installer.
     2. Follow the setup steps and agree to add Conda to your PATH if prompted.
   * **Install on macOS/Linux**:
     1. Open a terminal.
     2. Make the downloaded installer executable (if needed):

        ```bash
        chmod +x ~/Downloads/Miniconda3-*.sh
        ```
     3. Run the installer script:

        ```bash
        ~/Downloads/Miniconda3-*.sh
        ```
     4. Follow the prompts to complete the installation.
   * **Verify Installation**:

     ```bash
     conda --version
     ```

2. **SSH**: Required for Serveo port forwarding (or an alternative tunneling service).

## 1. Create and Activate the Conda Environment (If you have already installed the conda environment skip this step)

1. Open a terminal or command prompt and navigate to the backend project directory.

2. Create the environment from the provided YAML file:

   ```bash
   conda env create -f environment.yaml
   ```

3. Activate the newly created environment. Replace aidenti with the name defined in the YAML (check the `name:` field in `environment.yaml`):

   ```bash
   conda activate aidenti
   ```

## 2. Run the Flask API

With the environment active, start the Flask server by running the `api.py` file in the backend directory:

```bash
python api.py
```

By default, the server will listen on `http://localhost:5000`. Any way you see the host in the terminal (sometimes can be 127.0.0.0)

## 3. Forward the Port using Serveo

To expose your local backend to the internet via Serveo in a new terminal:

```bash
ssh -R 80:localhost:5000 serveo.net
```
Replace localhost/5000 if you host/port is different 

* This command will create a public URL (e.g., `https://your-serveo-subdomain.serveo.net`) forwarding to your local `5000` port.


## 4. Run Expo Front-End

```bash
npx expo start -c
```
s
---

With these steps, your Flask backend should be up and running and accessible for development and testing.
