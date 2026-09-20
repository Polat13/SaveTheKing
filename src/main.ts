import "./style.css";

import { createApp } from "./app/createApp";
import { Game } from "./app/Game";

const app = await createApp();

const game = new Game(app);

game.start();