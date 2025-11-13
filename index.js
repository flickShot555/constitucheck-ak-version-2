// index.js
import { registerRootComponent } from 'expo';
import App from './App';

// Tell Expo to bootstrap the App component
registerRootComponent(App);

// ALSO export App as the default export so Snack can see it:
export default App;
