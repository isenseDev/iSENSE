// Generated by CoffeeScript 1.6.1

/*
 * Copyright (c) 2011, iSENSE Project. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer. Redistributions in binary
 * form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials
 * provided with the distribution. Neither the name of the University of
 * Massachusetts Lowell nor the names of its contributors may be used to
 * endorse or promote products derived from this software without specific
 * prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
 * DAMAGE.
 *
*/


(function() {
  var field, hydrate, index, _ref, _ref1, _ref2, _ref3, _ref4,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  if (data.savedData != null) {
    hydrate = new Hydrate();
    globals.extendObject(data, hydrate.parse(data.savedData));
    delete data.savedData;
  }

  data.COMBINED_FIELD = 1;

  if ((_ref = data.types) == null) {
    data.types = {
      TIME: 7,
      TEXT: 37,
      GEOSPATIAL: 19
    };
  }

  if ((_ref1 = data.units) == null) {
    data.units = {
      GEOSPATIAL: {
        LATITUDE: 57,
        LONGITUDE: 58
      }
    };
  }

  /*
  Selects data in an x,y object format of the given group.
  */


  data.xySelector = function(xIndex, yIndex, groupIndex) {
    var mapFunc, mapped, rawData,
      _this = this;
    rawData = this.dataPoints.filter(function(dp) {
      var group, notNaN, notNull;
      group = (String(dp[_this.groupingFieldIndex])).toLowerCase() === _this.groups[groupIndex];
      notNull = (dp[xIndex] !== null) && (dp[yIndex] !== null);
      notNaN = (!isNaN(dp[xIndex])) && (!isNaN(dp[yIndex]));
      return group && notNull && notNaN;
    });
    if ((Number(this.fields[xIndex].typeID)) === data.types.TIME) {
      mapFunc = function(dp) {
        var obj;
        return obj = {
          x: new Date(dp[xIndex]),
          y: Number(dp[yIndex]),
          datapoint: dp
        };
      };
    } else {
      mapFunc = function(dp) {
        var obj;
        return obj = {
          x: Number(dp[xIndex]),
          y: Number(dp[yIndex]),
          datapoint: dp
        };
      };
    }
    mapped = rawData.map(mapFunc);
    mapped.sort(function(a, b) {
      return a.x - b.x;
    });
    return mapped;
  };

  /*
  Selects an array of data from the given field index.
  if 'nans' is true then datapoints with NaN values in the given field will be included.
  'filterFunc' is a boolean filter that must be passed (true) for a datapoint to be included.
  */


  data.selector = function(fieldIndex, groupIndex, nans) {
    var filterFunc, newFilterFunc, rawData,
      _this = this;
    if (nans == null) {
      nans = false;
    }
    filterFunc = function(dp) {
      return (String(dp[_this.groupingFieldIndex])).toLowerCase() === _this.groups[groupIndex];
    };
    newFilterFunc = nans ? filterFunc : function(dp) {
      return (filterFunc(dp)) && (!isNaN(dp[fieldIndex])) && (dp[fieldIndex] !== null);
    };
    rawData = this.dataPoints.filter(newFilterFunc);
    return rawData.map(function(dp) {
      return dp[fieldIndex];
    });
  };

  /*
  Gets the maximum (numeric) value for the given field index.
  All included datapoints must pass the given filter (defaults to all datapoints).
  */


  data.getMax = function(fieldIndex, groupIndex) {
    var rawData;
    rawData = this.selector(fieldIndex, groupIndex);
    if (rawData.length > 0) {
      return rawData.reduce(function(a, b) {
        return Math.max(Number(a), Number(b));
      });
    } else {
      return null;
    }
  };

  /*
  Gets the minimum (numeric) value for the given field index.
  All included datapoints must pass the given filter (defaults to all datapoints).
  */


  data.getMin = function(fieldIndex, groupIndex) {
    var rawData;
    rawData = this.selector(fieldIndex, groupIndex);
    if (rawData.length > 0) {
      return rawData.reduce(function(a, b) {
        return Math.min(Number(a), Number(b));
      });
    } else {
      return null;
    }
  };

  /*
  Gets the mean (numeric) value for the given field index.
  All included datapoints must pass the given filter (defaults to all datapoints).
  */


  data.getMean = function(fieldIndex, groupIndex) {
    var rawData;
    rawData = this.selector(fieldIndex, groupIndex);
    if (rawData.length > 0) {
      return (rawData.reduce(function(a, b) {
        return (Number(a)) + (Number(b));
      })) / rawData.length;
    } else {
      return null;
    }
  };

  /*
  Gets the median (numeric) value for the given field index.
  All included datapoints must pass the given filter (defaults to all datapoints).
  */


  data.getMedian = function(fieldIndex, groupIndex) {
    var mid, rawData;
    rawData = this.selector(fieldIndex, groupIndex);
    rawData.sort();
    mid = Math.floor(rawData.length / 2);
    if (rawData.length > 0) {
      if (rawData.length % 2) {
        return Number(rawData[mid]);
      } else {
        return ((Number(rawData[mid - 1])) + (Number(rawData[mid]))) / 2.0;
      }
    } else {
      return null;
    }
  };

  /*
  Gets the number of points belonging to fieldIndex and groupIndex
  All included datapoints must pass the given filter (defaults to all datapoints).
  */


  data.getCount = function(fieldIndex, groupIndex) {
    var dataCount;
    dataCount = this.selector(fieldIndex, groupIndex).length;
    return dataCount;
  };

  /*
  Gets the sum of the points belonging to fieldIndex and groupIndex
  All included datapoints must pass the given filter (defaults to all datapoints).
  */


  data.getTotal = function(fieldIndex, groupIndex) {
    var rawData, total, value, _i, _len;
    rawData = this.selector(fieldIndex, groupIndex);
    if (rawData.length > 0) {
      total = 0;
      for (_i = 0, _len = rawData.length; _i < _len; _i++) {
        value = rawData[_i];
        total = total + (Number(value));
      }
      return total;
    } else {
      return null;
    }
  };

  /*
  Gets a list of unique, non-null, stringified vals from the given field index.
  All included datapoints must pass the given filter (defaults to all datapoints).
  */


  data.setGroupIndex = function(index) {
    this.groupingFieldIndex = index;
    return this.groups = this.makeGroups();
  };

  /*
  Gets a list of unique, non-null, stringified vals from the group field index.
  */


  data.makeGroups = function() {
    var dp, groups, keys, result, _i, _len, _ref2;
    result = {};
    _ref2 = this.dataPoints;
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      dp = _ref2[_i];
      if (dp[this.groupingFieldIndex] !== null) {
        result[String(dp[this.groupingFieldIndex]).toLowerCase()] = true;
      }
    }
    groups = (function() {
      var _results;
      _results = [];
      for (keys in result) {
        _results.push(keys);
      }
      return _results;
    })();
    return groups.sort();
  };

  /*
  Gets a list of text field indicies
  */


  data.textFields = (function() {
    var _i, _len, _ref2, _results;
    _ref2 = data.fields;
    _results = [];
    for (index = _i = 0, _len = _ref2.length; _i < _len; index = ++_i) {
      field = _ref2[index];
      if ((Number(field.typeID)) === data.types.TEXT) {
        _results.push(Number(index));
      }
    }
    return _results;
  })();

  /*
  Gets a list of time field indicies
  */


  data.timeFields = (function() {
    var _i, _len, _ref2, _results;
    _ref2 = data.fields;
    _results = [];
    for (index = _i = 0, _len = _ref2.length; _i < _len; index = ++_i) {
      field = _ref2[index];
      if ((Number(field.typeID)) === data.types.TIME) {
        _results.push(Number(index));
      }
    }
    return _results;
  })();

  /*
  Gets a list of non-text, non-time field indicies
  */


  data.normalFields = (function() {
    var _i, _len, _ref2, _ref3, _results;
    _ref2 = data.fields;
    _results = [];
    for (index = _i = 0, _len = _ref2.length; _i < _len; index = ++_i) {
      field = _ref2[index];
      if ((_ref3 = Number(field.typeID)) !== data.types.TEXT && _ref3 !== data.types.TIME && _ref3 !== data.types.GEOSPATIAL) {
        _results.push(Number(index));
      }
    }
    return _results;
  })();

  /*
  Gets a list of non-text field indicies
  */


  data.numericFields = (function() {
    var _i, _len, _ref2, _ref3, _results;
    _ref2 = data.fields;
    _results = [];
    for (index = _i = 0, _len = _ref2.length; _i < _len; index = ++_i) {
      field = _ref2[index];
      if ((_ref3 = Number(field.typeID)) !== data.types.TEXT) {
        _results.push(Number(index));
      }
    }
    return _results;
  })();

  /*
  Gets a list of geolocation field indicies
  */


  data.geoFields = (function() {
    var _i, _len, _ref2, _results;
    _ref2 = data.fields;
    _results = [];
    for (index = _i = 0, _len = _ref2.length; _i < _len; index = ++_i) {
      field = _ref2[index];
      if ((Number(field.typeID)) !== data.types.GEOSPATIAL) {
        _results.push(Number(index));
      }
    }
    return _results;
  })();

  if ((_ref2 = data.logSafe) == null) {
    data.logSafe = (function() {
      var dataPoint, fieldIndex, _i, _j, _len, _len1, _ref3, _ref4;
      _ref3 = data.dataPoints;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        dataPoint = _ref3[_i];
        _ref4 = data.fields;
        for (fieldIndex = _j = 0, _len1 = _ref4.length; _j < _len1; fieldIndex = ++_j) {
          field = _ref4[fieldIndex];
          if (__indexOf.call(data.normalFields, fieldIndex) >= 0) {
            if ((Number(dataPoint[fieldIndex] <= 0)) && (dataPoint[fieldIndex] !== null)) {
              return 0;
            }
          }
        }
      }
      return 1;
    })();
  }

  /*
  Check various type-related issues
  */


  data.preprocessData = function() {
    var dp, fIndex, _i, _j, _len, _len1, _ref3, _ref4;
    _ref3 = data.dataPoints;
    for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
      dp = _ref3[_i];
      _ref4 = data.fields;
      for (fIndex = _j = 0, _len1 = _ref4.length; _j < _len1; fIndex = ++_j) {
        field = _ref4[fIndex];
        if (typeof dp[fIndex] === "string") {
          dp[fIndex] = dp[fIndex].replace(/"/g, "");
          dp[fIndex] = dp[fIndex].replace(/'/g, "");
          dp[fIndex] = dp[fIndex].replace(/\\/g, "");
        }
        switch (Number(field.typeID)) {
          case data.types.TIME:
            if (isNaN(Number(dp[fIndex]))) {
              dp[fIndex] = data.parseDate(dp[fIndex]);
            } else {
              dp[fIndex] = (new Date(Number(dp[fIndex]))).valueOf();
            }
            break;
          case data.types.TEXT:
            NaN;
            break;
          default:
            if (dp[fIndex] === "" || dp[fIndex] === null) {
              dp[fIndex] = NaN;
            } else {
              dp[fIndex] = Number(dp[fIndex]);
            }
        }
      }
    }
    return 1;
  };

  data.parseDate = function(str) {
    var clock, day, hourAdj, hours, milliseconds, minutes, month, seconds, terms, tz, year;
    year = month = day = minutes = seconds = milliseconds = 0;
    hours = 12;
    hourAdj = 0;
    if ((str.match(/pm/gi)) !== null) {
      hourAdj = 12;
    }
    str = str.replace(/[ap]m/gi, "");
    tz = str.match(/\ [\+\-]\d\d\d\d/g);
    if (tz !== null) {
      hourAdj += -((Number(tz[0])) / 100);
      str = str.replace(/\ [\+\-]\d\d\d\d/g, " ");
    }
    str = str.replace(/[\\\/\-,_]/g, " ");
    terms = str.split(" ");
    terms = terms.filter(function(item) {
      return item !== "";
    });
    try {
      if (((Number(terms[0])) > 12) || (isNaN(Number(terms[0])))) {
        year = Number(terms[0]);
        month = (new Date(terms[1] + " 20 1970")).getMonth();
        day = Number(terms[2]);
      } else {
        month = (new Date(terms[0] + " 20 1970")).getMonth();
        day = Number(terms[1]);
        year = Number(terms[2]);
      }
      clock = terms[3].split(":");
      hours = (Number(clock[0])) + hourAdj;
      minutes = Number(clock[1]);
      seconds = Math.floor(Number(clock[2]));
      milliseconds = ((Number(clock[2])) - seconds) * 1000;
    } catch (_error) {}
    if (isNaN(hours)) {
      hours = 12;
    }
    if (isNaN(minutes)) {
      minutes = 0;
    }
    if (isNaN(seconds)) {
      seconds = 0;
    }
    if (isNaN(milliseconds)) {
      milliseconds = 0;
    }
    return Date.UTC(year, month, day, hours, minutes, seconds, milliseconds);
  };

  data.preprocessData();

  if ((_ref3 = data.groupingFieldIndex) == null) {
    data.groupingFieldIndex = 0;
  }

  if ((_ref4 = data.groups) == null) {
    data.groups = data.makeGroups();
  }

}).call(this);
