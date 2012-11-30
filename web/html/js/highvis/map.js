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

  window.Map = (function(_super) {

    __extends(Map, _super);

    function Map(canvas) {
      this.canvas = canvas;
      this.HEATMAP_NONE = -2;
      this.HEATMAP_MARKERS = -1;
      this.visibleMarkers = 1;
      this.heatmapSelection = this.HEATMAP_NONE;
      this.heatmapRadius = 30;
    }

    Map.prototype.serializationCleanup = function() {
      delete this.gmap;
      delete this.heatPoints;
      delete this.markers;
      return delete this.heatmap;
    };

    Map.prototype.start = function() {
      var dataPoint, group, index, lat, latlngbounds, lon, mapOptions, marker, _fn, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4,
        _this = this;
      ($('#' + this.canvas)).show();
      if (this.markers != null) {
        _ref = this.markers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          group = _ref[_i];
          for (_j = 0, _len1 = group.length; _j < _len1; _j++) {
            marker = group[_j];
            google.maps.event.clearInstanceListeners(marker);
          }
        }
      }
      this.markers = [];
      _ref1 = data.groups;
      for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
        group = _ref1[_k];
        this.markers.push([]);
      }
      this.heatmaps = {};
      this.heatPoints = {};
      this.heatPoints[this.HEATMAP_NONE] = [];
      this.heatPoints[this.HEATMAP_MARKERS] = [];
      _ref2 = data.normalFields;
      for (_l = 0, _len3 = _ref2.length; _l < _len3; _l++) {
        index = _ref2[_l];
        this.heatPoints[index] = [];
      }
      for (index in this.heatPoints) {
        _ref3 = data.groups;
        for (_m = 0, _len4 = _ref3.length; _m < _len4; _m++) {
          group = _ref3[_m];
          this.heatPoints[index].push([]);
        }
      }
      latlngbounds = new google.maps.LatLngBounds();
      mapOptions = {
        center: new google.maps.LatLng(0, 0),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.SATELLITE
      };
      this.gmap = new google.maps.Map(document.getElementById(this.canvas), mapOptions);
      _ref4 = data.dataPoints;
      _fn = function() {
        var color, dat, field, fieldIndex, groupIndex, info, label, lat, latlng, lon, newMarker, _len6, _len7, _len8, _o, _p, _q, _ref5, _ref6, _ref7;
        _ref5 = data.fields;
        for (fieldIndex = _o = 0, _len6 = _ref5.length; _o < _len6; fieldIndex = ++_o) {
          field = _ref5[fieldIndex];
          if ((Number(field.typeID)) === data.types.GEOSPATIAL) {
            if ((Number(field.unitID)) === data.units.GEOSPATIAL.LATITUDE) {
              lat = dataPoint[fieldIndex];
            } else if ((Number(field.unitID)) === data.units.GEOSPATIAL.LONGITUDE) {
              lon = dataPoint[fieldIndex];
            }
          }
        }
        if ((lat === null) || (lon === null)) {
          return;
        }
        groupIndex = data.groups.indexOf(dataPoint[data.groupingFieldIndex].toLowerCase());
        color = globals.colors[groupIndex % globals.colors.length];
        latlng = new google.maps.LatLng(lat, lon);
        label = "<div style='font-size:9pt;overflow-x:none;'>";
        label += "<div style='width:100%;text-align:center;color:" + color + ";'> " + dataPoint[data.groupingFieldIndex] + "</div>";
        label += "<table>";
        _ref6 = data.fields;
        for (fieldIndex = _p = 0, _len7 = _ref6.length; _p < _len7; fieldIndex = ++_p) {
          field = _ref6[fieldIndex];
          if (!(dataPoint[fieldIndex] !== null)) {
            continue;
          }
          dat = (Number(field.typeID)) === data.types.TIME ? globals.dateFormatter(dataPoint[fieldIndex]) : dataPoint[fieldIndex];
          label += "<tr><td>" + field.fieldName + "</td>";
          label += "<td><strong>" + dat + "</strong></td></tr>";
        }
        label += "</table></div>";
        info = new google.maps.InfoWindow({
          content: label
        });
        if (__indexOf.call(globals.groupSelection, groupIndex) >= 0) {
          latlngbounds.extend(latlng);
        }
        newMarker = new StyledMarker({
          styleIcon: new StyledIcon(StyledIconTypes.MARKER, {
            color: color
          }),
          position: latlng,
          map: _this.gmap
        });
        google.maps.event.addListener(newMarker, 'click', function() {
          return info.open(_this.gmap, newMarker);
        });
        _this.markers[groupIndex].push(newMarker);
        _ref7 = data.normalFields;
        for (_q = 0, _len8 = _ref7.length; _q < _len8; _q++) {
          index = _ref7[_q];
          if (dataPoint[index] !== null) {
            _this.heatPoints[index][groupIndex].push({
              weight: dataPoint[index],
              location: latlng
            });
          }
        }
        return _this.heatPoints[_this.HEATMAP_MARKERS][groupIndex].push(latlng);
      };
      for (_n = 0, _len5 = _ref4.length; _n < _len5; _n++) {
        dataPoint = _ref4[_n];
        lat = lon = null;
        _fn();
      }
      this.gmap.fitBounds(latlngbounds);
      return Map.__super__.start.call(this);
    };

    Map.prototype.update = function() {
      var groupArray, groupIndex, heatArray, heats, index, mark, markGroup, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
      heats = [];
      _ref = this.heatPoints;
      for (index in _ref) {
        heatArray = _ref[index];
        if ((Number(index)) === this.heatmapSelection) {
          for (groupIndex = _i = 0, _len = heatArray.length; _i < _len; groupIndex = ++_i) {
            groupArray = heatArray[groupIndex];
            if (__indexOf.call(globals.groupSelection, groupIndex) >= 0) {
              heats = heats.concat(groupArray);
            }
          }
        }
      }
      if (this.heatmap != null) {
        this.heatmap.setMap(null);
      }
      this.heatmap = new google.maps.visualization.HeatmapLayer({
        data: heats,
        radius: this.heatmapRadius,
        dissipating: true
      });
      this.heatmap.setMap(this.gmap);
      _ref1 = this.markers;
      for (index = _j = 0, _len1 = _ref1.length; _j < _len1; index = ++_j) {
        markGroup = _ref1[index];
        for (_k = 0, _len2 = markGroup.length; _k < _len2; _k++) {
          mark = markGroup[_k];
          mark.setVisible((__indexOf.call(globals.groupSelection, index) >= 0) && this.visibleMarkers === 1);
        }
      }
      return Map.__super__.update.call(this);
    };

    Map.prototype.end = function() {
      ($('#' + this.canvas)).hide();
      return this.heatmap = void 0;
    };

    Map.prototype.drawControls = function() {
      Map.__super__.drawControls.call(this);
      this.drawGroupControls(true);
      this.drawToolControls();
      return this.drawSaveControls();
    };

    Map.prototype.drawToolControls = function() {
      var controls, fieldIndex, sel, _i, _len, _ref, _ref1,
        _this = this;
      controls = '<div id="toolControl" class="vis_controls">';
      controls += "<h3 class='clean_shrink'><a href='#'>Tools:</a></h3>";
      controls += "<div class='outer_control_div'>";
      controls += "<h4 class='clean_shrink'>Heat Maps</h4>";
      controls += '<div class="inner_control_div"> Map By: ';
      controls += '<select id="heatmapSelector" class="control_select">';
      sel = this.heatmapSelection === this.HEATMAP_NONE ? 'selected' : '';
      controls += "<option value=\"" + this.HEATMAP_NONE + "\" " + sel + ">None</option>";
      sel = this.heatmapSelection === this.HEATMAP_MARKERS ? 'selected' : '';
      controls += "<option value=\"" + this.HEATMAP_MARKERS + "\" " + sel + ">Location</option>";
      _ref = data.normalFields;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        fieldIndex = _ref[_i];
        sel = this.heatmapSelection === fieldIndex ? 'selected' : '';
        controls += "<option value=\"" + (Number(fieldIndex)) + "\" " + sel + ">" + data.fields[fieldIndex].fieldName + "</option>";
      }
      controls += "</select></div>";
      controls += "<br>";
      controls += "<div class='inner_control_div'> Heatmap Radius: ";
      controls += "<b id='radiusText'>" + this.heatmapRadius + "</b></div>";
      controls += "<div id='heatmapSlider' style='width:95%'></div>";
      controls += "<br>";
      controls += "<h4 class='clean_shrink'>Other</h4>";
      controls += '<div class="inner_control_div">';
      controls += "<input id='markerBox' type='checkbox' name='marker_selector' " + (this.visibleMarkers === 1 ? 'checked' : '') + "/> Markers ";
      controls += "</div></div></div>";
      ($('#controldiv')).append(controls);
      ($('#markerBox')).click(function(e) {
        _this.visibleMarkers = (_this.visibleMarkers + 1) % 2;
        return _this.delayedUpdate();
      });
      ($('#heatmapSelector')).change(function(e) {
        var element;
        element = e.target || e.srcElement;
        _this.heatmapSelection = Number(element.value);
        return _this.delayedUpdate();
      });
      ($('#heatmapSlider')).slider({
        range: 'min',
        value: this.heatmapRadius,
        min: 5,
        max: 150,
        step: 5,
        slide: function(event, ui) {
          _this.heatmapRadius = Number(ui.value);
          ($('#radiusText')).html("" + _this.heatmapRadius);
          return _this.delayedUpdate();
        }
      });
      if ((_ref1 = globals.toolsOpen) == null) {
        globals.toolsOpen = 0;
      }
      ($('#toolControl')).accordion({
        collapsible: true,
        active: globals.toolsOpen
      });
      return ($('#toolControl > h3')).click(function() {
        return globals.toolsOpen = (globals.toolsOpen + 1) % 2;
      });
    };

    Map.prototype.resize = function(newWidth, newHeight, duration) {
      var func,
        _this = this;
      func = function() {
        return google.maps.event.trigger(_this.gmap, 'resize');
      };
      return setTimeout(func, duration);
    };

    return Map;

  })(BaseVis);

  if (__indexOf.call(data.relVis, "Map") >= 0) {
    globals.map = new Map("map_canvas");
  } else {
    globals.map = new DisabledVis("map_canvas");
  }

}).call(this);
