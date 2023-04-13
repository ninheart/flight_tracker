// Filter find routes button functionality
import {updateMapWithFlights} from "../static/map_script.js";

export function displayFilteredFlights() {
    const data = getDataFromFilterMenu();

    setCookie("form",data,5);

    $.ajax({
        url: 'http://127.0.0.1:5000/form', success: function(data) {
            updateMapWithFlights(eval(data));
        }
    });
}

function setCookie(c_name, value, expireminutes) {
    let exdate = new Date();
    exdate.setMinutes(exdate.getMinutes()+expireminutes);
    document.cookie=c_name+ "=" +escape(value)+
        ((expireminutes==null) ? "" : ";expires="+exdate.toUTCString());
}

function getDataFromFilterMenu() {
    let data = [];

    // Earliest Start Time
    const departure_date = document.getElementById("start_date").value;
    const departure_time = document.getElementById("start_time").value;

    let new_time = departure_time.replace(":", "");
    data.push(departure_date);
    data.push(String(new_time));

    // Latest End Time
    const arrival_date = document.getElementById("end_date").value;
    const arrival_time = document.getElementById("end_time").value;

    new_time = arrival_time.replace(":", "");
    data.push(arrival_date);
    data.push(String(new_time));


    // Day of Week
    const sunday = document.getElementById("sunday_button").classList.contains("active");
    const monday = document.getElementById("monday_button").classList.contains("active");
    const tuesday = document.getElementById("tuesday_button").classList.contains("active");
    const wednesday = document.getElementById("wednesday_button").classList.contains("active");
    const thursday = document.getElementById("thursday_button").classList.contains("active");
    const friday = document.getElementById("friday_button").classList.contains("active");
    const saturday = document.getElementById("saturday_button").classList.contains("active");

    if (sunday == monday && monday == tuesday && tuesday == wednesday && wednesday == thursday && thursday == friday && friday == saturday)
        for (let i = 0; i < 7; i++)
            data.push(true);
    else {
        data.push(sunday);
        data.push(monday);
        data.push(tuesday);
        data.push(wednesday);
        data.push(thursday);
        data.push(friday);
        data.push(saturday);
    }

    // Start Location
    const departure_location_type = document.getElementById("start_filter").value;
    let departure_location_values;
    let startID;
    if (departure_location_type === "airport") {
        startID = "#airport_start_info";
    } else if (departure_location_type === "country") {
        startID = "#country_start_info";
    } else if (departure_location_type === "continent") {
        startID = "#continent_start_info";
    }

    departure_location_values = $(startID).val();

    if (departure_location_values.length == 0) {
        departure_location_values = [];
        $(startID + " option").each(function() {
            departure_location_values.push($(this).val());
        });
    }

    data.push(departure_location_type);
    data.push(departure_location_values);

    // End Location
    const arrival_location_type = document.getElementById("end_filter").value;
    let arrival_location_values;
    let endID;
    if (arrival_location_type === "airport") {
        endID = "#airport_end_info";
    } else if (arrival_location_type === "country") {
        endID = "#country_end_info";
    } else if (arrival_location_type === "continent") {
        endID = "#continent_end_info";
    }

    arrival_location_values = $(endID).val();

    if (arrival_location_values.length == 0) {
        arrival_location_values = [];
        $(endID + " option").each(function() {
            arrival_location_values.push($(this).val());
        });
    }

    data.push(arrival_location_type);
    data.push(arrival_location_values);

    // Max Layovers
    data.push(String(parseInt(document.getElementById("max_layovers").value)));

    // Airlines
    let airlines = $('#airline_companies').val();
    if (airlines.length == 0) {
        airlines = [];
        $('#airline_companies' + " option").each(function() {
            airlines.push($(this).val());
        })
    }
    data.push(airlines);

    // Type of Airline
    const cargo = document.getElementById("cargo_button").classList.contains("active");
    const passenger = document.getElementById("passenger_button").classList.contains("active");
    if (cargo == passenger) {
        data.push(true);
        data.push(true);
    }
    else {
        data.push(cargo);
        data.push(passenger);
    }

    // Advanced Options
    const added = document.getElementById("find_added_flights_button").classList.contains("active");
    const removed = document.getElementById("find_removed_flights_button").classList.contains("active");
    const start_date = document.getElementById("start_date2").value;
    const start_time = document.getElementById("start_time2").value;
    data.push(start_date);
    new_time = start_time.replace(":", "");
    data.push(new_time);
    const end_date = document.getElementById("end_date2").value;
    const end_time = document.getElementById("end_time2").value;
    data.push(end_date);
    new_time = end_time.replace(":", "");
    data.push(new_time);
    data.push(added);
    data.push(removed);

    return data.join("--");
}