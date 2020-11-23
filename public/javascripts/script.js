// const { localsAsTemplateData } = require("hbs"); // commented this as it was giving me errors
const mainButton = document.getElementById("initialDisplay")
// var data = [<%= chartData %>];
// console.log(data)

// const express = require('../../express');
// const router  = express.Router();

// const User = require('../models/User');
// const HelpSession = require('../models/HelpSession')

// const middlewares = require('./middlewares');


document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);

// this displays the charts
mainButton.addEventListener('click', () => {

    fetch('/private/sessions')
    .then(res => res.json())
    .then(data => {
        let dataArr = []
        for (let i = 0; i < data.sessions.length; i++){
            dataArr.push(data.sessions[i].userRating)
        }
        let namesArr = []
        for (let i = 0; i < data.sessions.length; i++){
            namesArr.push(data.sessions[i].student.username)
        }
        // console.log(data.sessions[0].student.username)
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: namesArr,
                datasets: [{
                    label: 'Average rating',
                    data: dataArr,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
      })
    })
  
