+(function (window, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        window.pathRoundedCorner = factory();
    }
})(this, function () {

  return exec;

  function exec(pathString) {
    var resultCommands = [];
    var pathParts = getPathParts(pathString);
    var commands = getCommands(pathParts);
    var prevCmd, curCmd, nextCmd, prevPoint, curPoint, nextPoint, curveStart, curveEnd;

    if (commands.length > 1) {
      // 儲存開始點
      resultCommands.push(commands[0]);

      for (var cmdIndex = 1; cmdIndex < commands.length; cmdIndex++) {

        prevCmd = resultCommands[resultCommands.length - 1];
        curCmd = commands[cmdIndex];
        nextCmd = commands[cmdIndex + 1];

        if (nextCmd && prevCmd && (prevCmd.length > 2) && curCmd[0] == "L" && (nextCmd.length > 2) && nextCmd[0] == "L") {
          prevPoint = pointForCommand(prevCmd);
          curPoint = pointForCommand(curCmd);
          nextPoint = pointForCommand(nextCmd);
          
          curveStart = getPointFromLength(curPoint, prevPoint, 10);
          curveEnd = getPointFromLength(curPoint, nextPoint, 10);
          
          resultCommands.push(['L', curveStart.x, curveStart.y]);
          resultCommands.push(['Q', curPoint.x, curPoint.y, curveEnd.x, curveEnd.y]);
        } else {
          resultCommands.push(curCmd);
        }
      }
    } else {
      resultCommands = commands;
    }

    return resultCommands.reduce(function(str, c) {
      return str + c.join(" ") + " ";
    }, "");
  }

  function getPathParts(pathString) {
    return pathString
      .split(/[,\s]/)
      .reduce(function(parts, part){
        var match = part.match("(.*)([a-zA-Z])(.+)");
        if (match) {
          match.forEach(function(val, idx) {
            if (idx > 0 && val.length) {
              parts.push(val);
            }
          });
        } else {
          parts.push(part);
        }
        
        return parts;
      }, []);
  }

  function getCommands(pathParts) {
    return pathParts.reduce(function(commands, part) {
      if (parseFloat(part) == part && commands.length) {
        commands[commands.length - 1].push(part);
      } else {
        commands.push([part]);
      }
      
      return commands;
    }, []);
  }

  function pointForCommand(cmd) {
    return {
      x: parseFloat(cmd[cmd.length - 2]),
      y: parseFloat(cmd[cmd.length - 1]),
    };
  }

  function getPointFromLength(startPoint, endPoint, length) {
    var path = document.createElementNS(d3.namespaces.svg, 'path');
    var d3Path = d3.select(path);
    var data = [startPoint, endPoint];
    var line = d3.line()
      .x(function(d) {
        return d.x;
      })
      .y(function(d) {
        return d.y;
      })

    d3Path.datum(data);
    d3Path.attr('d', line);

    var point = path.getPointAtLength(length);

    return {
      x: point.x,
      y: point.y
    };
  }

});