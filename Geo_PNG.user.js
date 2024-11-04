// ==UserScript==
// @name         WME Link to Geoportal Papua New Guinea
// @description  Adds buttons to Waze Map Editor to open the Geoportal of Papua New Guinea.
// @namespace    https://github.com/Dwinger2006/Geo_PNG
// @version      2024.11.04.01
// @include      https://*.waze.com/editor*
// @include      https://*.waze.com/*editor*
// @grant        none
// @author       Dancingman81
// @license      MIT
// @syncURL      https://github.com/Dwinger2006/Geo_PNG/raw/main/Geo_PNG.user.js
// @downloadURL  https://update.greasyfork.org/scripts/510495/WME%20Link%20to%20Geoportal%20Luxembourg%20and%20Traffic%20Info.user.js
// @updateURL    https://update.greasyfork.org/scripts/510495/WME%20Link%20to%20Geoportal%20Luxembourg%20and%20Traffic%20Info.meta.js
// ==/UserScript==

var PNGGeo_version = '2024.11.04.01';

(async function() {
    'use strict';

    // Reference for the Geoportal window
    let geoportalWindow = null;

    // Initialize buttons once WME is ready
    function initialize() {
        if (typeof W !== 'undefined' && W.userscripts && W.userscripts.state.isReady) {
            addButtons();
        } else {
            console.log("WME is not ready yet, retrying...");
            document.addEventListener("wme-ready", initialize, { once: true });
        }
    }

    // Function to create the button for Geoportal Papua New Guinea
    function createPNGButton() {
        console.log("Creating Geoportal Papua New Guinea button");
        var png_btn = document.createElement('button');
        png_btn.style = "width: 285px;height: 24px; font-size:85%;color: green;border-radius: 5px;border: 0.5px solid lightgrey; background: white; margin-bottom: 10px;";
        png_btn.innerHTML = "Geoportal Papua-Neuguinea";

        png_btn.addEventListener('click', function() {
            if (W.map) {
                let coords = W.map.getUnvalidatedUnprojectedCenter();
                let point = new OpenLayers.LonLat(coords.lon, coords.lat);
                let transformed = point.transform('EPSG:3857', 'EPSG:4326'); // Transformation to WGS 84

                // Construct the URL for Papua New Guinea Geoportal
                var mapsUrl = 'https://png-geoportal.org/catalogue/#/map/111?lat=' + transformed.lat + '&lon=' + transformed.lon + '&zoom=' + W.map.getZoom();

                console.log("Geoportal URL:", mapsUrl);

                // Open or focus the Geoportal window
                if (geoportalWindow && !geoportalWindow.closed) {
                    geoportalWindow.location.href = mapsUrl;
                    geoportalWindow.focus();
                } else {
                    geoportalWindow = window.open(mapsUrl, 'geoportalPNG');
                }
            } else {
                console.error("W.map is not available.");
            }
        });

        return png_btn;
    }

    // Function to add buttons to the WME side panel
    function addButtons() {
        console.log("Adding buttons...");

        if (!W.userscripts.state.isReady) {
            console.log("WME is not ready yet, retrying...");
            document.addEventListener("wme-ready", addButtons, { once: true });
            return;
        }

        // Check if the panel already exists to avoid duplicate entries
        if (document.getElementById("sidepanel-png") !== null) {
            console.log("Buttons already exist.");
            return;
        }

        var addon = document.createElement('section');
        addon.id = "png-addon";
        addon.innerHTML = `
        <b><p style="font-family:verdana,sans-serif; font-size:12px; text-decoration: none;">
        <a href="https://greasyfork.org/de/scripts/510495-wme-link-to-geoportal-luxembourg-and-traffic-info" target="_blank">
        <b>Links to PNG Geoportal </b>v ${PNGGeo_version}</a></p>`;

        var userTabs = document.getElementById('user-info');
        var navTabs = userTabs?.getElementsByClassName('nav-tabs')[0];
        var tabContent = userTabs?.getElementsByClassName('tab-content')[0];

        if (navTabs && tabContent) {
            var newtab = document.createElement('li');
            newtab.innerHTML = '<a href="#sidepanel-png" data-toggle="tab">Geo PNG</a>';
            navTabs.appendChild(newtab);

            var newtabContent = document.createElement('div');
            newtabContent.id = "sidepanel-png";
            newtabContent.className = "tab-pane";
            newtabContent.appendChild(addon);

            tabContent.appendChild(newtabContent);

            var pngButton = createPNGButton();

            addon.appendChild(pngButton);

            console.log("Buttons added successfully.");
        } else {
            console.error("Could not find user info panel to add buttons.");
        }
    }

    // Initialize the script
    initialize();

})();