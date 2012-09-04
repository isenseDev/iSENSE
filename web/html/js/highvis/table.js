// Generated by CoffeeScript 1.3.3

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
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.Table = (function(_super) {

    __extends(Table, _super);

    function Table(canvas) {
      this.canvas = canvas;
    }

    Table.prototype.start = function() {
      ($('#' + this.canvas)).show();
      return Table.__super__.start.call(this);
    };

    Table.prototype.update = function() {
      var atable, dat, dataPoint, dt, field, fieldIndex, group, groupIndex, header, headers, line, row, rows, visibleGroups, _i, _j, _len, _len1;
      ($('#' + this.canvas)).html('');
      ($('#' + this.canvas)).append('<table id="data_table"></table>');
      ($('#data_table')).append('<thead><tr id="table_headers"></tr></thead>');
      headers = (function() {
        var _i, _len, _ref, _results;
        _ref = data.fields;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          field = _ref[_i];
          _results.push("<td>" + field.fieldName + "</td>");
        }
        return _results;
      })();
      for (_i = 0, _len = headers.length; _i < _len; _i++) {
        header = headers[_i];
        ($('#table_headers')).append(header);
      }
      visibleGroups = (function() {
        var _j, _len1, _ref, _results;
        _ref = data.groups;
        _results = [];
        for (groupIndex = _j = 0, _len1 = _ref.length; _j < _len1; groupIndex = ++_j) {
          group = _ref[groupIndex];
          if (__indexOf.call(globals.groupSelection, groupIndex) >= 0) {
            _results.push(group);
          }
        }
        return _results;
      })();
      rows = (function() {
        var _j, _len1, _ref, _ref1, _results;
        _ref = data.dataPoints;
        _results = [];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          dataPoint = _ref[_j];
          if (!(_ref1 = (String(dataPoint[data.groupingFieldIndex])).toLowerCase(), __indexOf.call(visibleGroups, _ref1) >= 0)) {
            continue;
          }
          line = (function() {
            var _k, _len2, _results1;
            _results1 = [];
            for (fieldIndex = _k = 0, _len2 = dataPoint.length; _k < _len2; fieldIndex = ++_k) {
              dat = dataPoint[fieldIndex];
              if ((Number(data.fields[fieldIndex].typeID)) === data.types.TIME) {
                _results1.push("<td>" + (new Date(dat)) + "</td>");
              } else {
                _results1.push("<td>" + dat + "</td>");
              }
            }
            return _results1;
          })();
          _results.push("<tr>" + (line.reduce(function(a, b) {
            return a + b;
          })) + "</tr>");
        }
        return _results;
      })();
      ($('#data_table')).append('<tbody id="table_body"></tbody>');
      for (_j = 0, _len1 = rows.length; _j < _len1; _j++) {
        row = rows[_j];
        ($('#table_body')).append(row);
      }
      dt = {
        sScrollY: 400,
        sScrollX: "100%",
        iDisplayLength: -1,
        bDeferRender: true,
        bJQueryUI: true
      };
      atable = ($('#data_table')).dataTable(dt);
      return Table.__super__.update.call(this);
    };

    Table.prototype.end = function() {
      return ($('#' + this.canvas)).hide();
    };

    Table.prototype.drawControls = function() {
      Table.__super__.drawControls.call(this);
      return this.drawGroupControls();
    };

    return Table;

  })(BaseVis);

  globals.table = new Table("table_canvas");

}).call(this);
