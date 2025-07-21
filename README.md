# AIdenti

 <p align="center">
	<img src="https://raw.githubusercontent.com/salvogalati/aidenti/refs/heads/main/app/assets/logoApp.png" alt="Descrizione" width="150"/>
</p>

This repository contains the source code for the mobile application AIdenti and its associated backend. The app is developed using [Expo](https://expo.dev) (React Native) for the frontend and [Flask](https://flask.palletsprojects.com/) for the backend.

  

## Project Structure

  

-  **app/**: mobile app source code (Expo/React Native)

-  **backend/**: backend API written in Python/Flask

-  **assets/**: static resources (icons, images, etc.)

- Other configuration files (e.g., `package.json`, `environment.yaml`, etc.)

  

---

  

## Getting Started

  

### 1. Backend (Flask)

  

Follow the detailed instructions in [`backend/README.md`](./backend/README.md) to:

  

- Install Miniconda (if necessary)

- Create and activate the conda environment

- Start the Flask server (`python api.py`)

- Expose the backend via Serveo or another SSH tunnel

  

### 2. Frontend (Expo/React Native)

  

Make sure you have Node.js and npm installed.

  

1. Install dependencies:

  

```bash

npm install

```

  

2. Start the Expo app:

  

```bash

npx expo start

```

  

From the Expo console, you can choose to open the app on an Android/iOS emulator or a physical device using the Expo Go app.

  

---

  

## Development

  

- The app code is located in the `app/` directory.

- To edit global styles, see `global.css`.

- Tailwind CSS configuration is in `tailwind.config.js`.

- The app communicates with the backend via HTTP calls to the address provided by the Serveo tunnel.

  

---

  

## Useful Resources

  

- [Expo Documentation](https://docs.expo.dev/)

- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/)

- [Flask Documentation](https://flask.palletsprojects.com/)

  

---

  

## Contributions

  

If you want to contribute, open an issue or a pull request! For questions, you can use the project board or contact the maintainers.

  

---

  

## Notes

  

- Remember to configure the app’s connection to the backend by modifying environment variables or config files as instructed.

- Any significant change to the backend should also be documented in `backend/README.md`.
