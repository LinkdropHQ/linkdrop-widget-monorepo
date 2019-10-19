"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styles = void 0;
// @media (max-width: 576px) {
//     .ld-container {
//       bottom: 0;
//       top: auto;
//     }
// }
// @media (max-width: 576px) {
//     .por_portis-widget-frame {
//       bottom: 0;
//       top: auto;
//       width: 100%;
//       right: 0;
//       left: 0;
//       border-bottom-left-radius: 0;
//       border-bottom-right-radius: 0;
//     }
// }
var styles = "\n.ld-widget-container {\n  width: 100%;    \n  top: 0px;\n  height: 0px;\n  z-index: 2147483647;\n}\n\n.ld-widget-iframe {\n  position: fixed;\n  height: 405px;\n  display: none;\n  bottom: 85px;\n  right: 10px;\n  border: none;\n  width: calc(100% - 20px);\n  max-width: 395px;\n  background: white;\n  border-radius: 5px;\n  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);\n  border: 0 transparent;\n  overflow: hidden;\n  z-index: 2147483000;\n}\n\n.ld-widget-icon {\n  z-index: 2147483647;        \n  position: fixed;\n  bottom: 10px;\n  right: 10px;\n  height: 60px;\n  border-radius: 60px;\n  width: 60px;\n  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAbCAYAAABr/T8RAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAErSURBVHgB7ZbhbcIwEIWfUQfoBvUI7QQNE5QVmKDtBt2gZYJ2BDpBwgSMQDbAG5j3iIETAokfnP/AJz1ZuUh5ce58F4DknN+pVfZjSU1gCDLl+kN1VA8fGipS4xBCh7LblQRH+PxHak3NbVD8whl6tHaDo7JOGIyoiHKczXUHP57L+sI89zvjBYbCeoIvDZWocbUcC6WzFFk7QkX0ibn8U01VY8vtGT/AAXUqLmrFEUMVz0p+fY1Ji8O5FWpQOr9pF7j6p6ZBc2QqosxtwCPH8ZK4h7EmUDoR/4OnccnjFIfZruvPKsVFE+16XiZeskXlamxeoD93794yqxr3OH/2PHiVp4prRn1rOGOYlQk+qH+/YdjkdBuh6Vf5M/BGHh/yDPaVsv+f5v5MbwAM7039gyk2JgAAAABJRU5ErkJggg==') 50% 50% no-repeat;\n  background-color: #0025FF;\n  cursor: pointer;\n  transition: background-color .3s;\n  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);\n}\n\n.ld-widget-icon.ld-widget-icon-opened {\n  background-color: #979797;\n  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACWSURBVHgBpdQLCoAgDAZg6aLtZnYzj+AR/hwqVOheDQax8sNwMwHILUvLMwWD17asbKXxMMONDmxG4QLhHWb0g3HQfOFGt9jjAzOqYh7UjFlQNyahYUxA45iCkrTm0ExjzbS7U/hl30StDgDRiZJO043C0BpmFI4+U1EEmnaL4scELFH029qNbdDKhQv91qYUjIHyxvINGgF+mDav5JQAAAAASUVORK5CYII=');\n}\n\n";
exports.styles = styles;