import {DrawitCanvas} from "./index";
import './styles/normalize.css';
import './styles/index.css';

const app = document.getElementById("app");

// @ts-ignore
document.canvas = new DrawitCanvas(app!);
