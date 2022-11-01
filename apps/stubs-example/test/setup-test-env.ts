import "@testing-library/jest-dom/extend-expect";
import { JSDOM } from "jsdom";

// Workaround: For some reason FormData is not set to jsdom's by default
const jsdom = new JSDOM(`<!doctype html>`);
const { FormData } = jsdom.window;
window.FormData = FormData;
global.FormData = FormData;
