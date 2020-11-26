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
    renderAvgSessDuration()
    renderAvgSessRating()
    renderAvgSessRatingByTA()
  console.log('JS file connected successfully');

}, false);

test = () => {
    console.log('test')
}
// this displays the charts
renderAvgSessRating = () => {

    fetch('/private/sessions')
    .then(res => res.json())
    .then(data => {
        let dataArr = []
        let sum = 0
        for (let i = 0; i < data.sessions.length; i++){
                sum += data.sessions[i].userRating
            }
        let avg = sum/data.sessions.length
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                barThickness: 2,
                labels: ['Average session rating'],
                datasets: [{
                    label: 'Average rating',
                    data: [avg],
                    backgroundColor: [
                        'rgba(255, 159, 64, .2)'
                    ],
                    borderColor: [
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
    }
  
    renderAvgSessDuration = () => {

        fetch('/private/doneSessions')
        .then(res => res.json())
        .then(data => {
            let dataArr = []
            let sum = 0
            for (let i = 0; i < data.sessions.length; i++){
                    sum += data.sessions[i].sessionDuration
                }
            let avg = sum/data.sessions.length
            var ctx = document.getElementById('myChart3').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Average session duration'],
                    datasets: [{
                        label: 'Average duration in minutes',
                        data: [avg],
                        backgroundColor: [
                            'rgba(153, 102, 255, .02)'
                        ],
                        borderColor: [
                            'rgba(153, 102, 255, 1)'
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
        }


        renderAvgSessRatingByTA = () => {

            fetch('/private/doneSessions')
            .then(res => res.json())
            .then(data => {
                console.log(data.sessions)
                let taObj = {}
                let names = []
                let sessRating = []
                for (let i = 0; i < data.sessions.length; i++){
                    if (taObj[data.sessions[i].teacher.username]){
                        taObj[data.sessions[i].teacher.username][0] += data.sessions[i].userRating
                        taObj[data.sessions[i].teacher.username][1] += 1
                      } else {
                        taObj[data.sessions[i].teacher.username] = [data.sessions[i].userRating, 1]
                      }
                    }
                    
                for (let el in taObj){
                    taObj[el][2] = taObj[el][0]/taObj[el][1]
                    names.push(el)
                    sessRating.push(taObj[el][2])
                    console.log(names, sessRating)
                }
                
                var ctx = document.getElementById('myChart2').getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'bar',
                    maintainAspectRatio: false,
                    data: {
                        labels: names,
                        datasets: [{
                            label: 'Average session rating by TA',
                            data: sessRating,
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
            }