/* tslint:disable */
/* eslint-disable */
/**
*/
export enum Cell {
  Dead = 0,
  Alive = 1,
}
/**
*/
export class Universe {
  free(): void;
/**
* @returns {Universe}
*/
  static new(): Universe;
/**
* Set the width of the universe.
*
* Resets all cells to the dead state.
* @param {number} width
*/
  set_width(width: number): void;
/**
* Set the height of the universe.
*
* Resets all cells to the dead state.
* @param {number} height
*/
  set_height(height: number): void;
/**
* @returns {number}
*/
  width(): number;
/**
* @returns {number}
*/
  height(): number;
/**
* @returns {number}
*/
  cells(): number;
/**
* @returns {string}
*/
  render(): string;
/**
* @param {number} row
* @param {number} column
*/
  toggle_cell(row: number, column: number): void;
/**
* @param {number} row
* @param {number} column
* @param {Cell} alive
*/
  set_cell_status(row: number, column: number, alive: Cell): void;
/**
*/
  tick(): void;
}
