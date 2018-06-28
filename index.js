const Koa = require("koa")
const Router = require("koa-router")
const serve = require("koa-static")
const render = require("koa-ejs")
const path = require("path")
const fetch = require("node-fetch")
const fs = require("fs")
// const Chart = require('chart.js')


// const myChart = new Chart(ctx, {...});
const app = new Koa()
const router = new Router()

const func = require('./lib/calScore.js')


render(app, {
  root: path.join(__dirname, "views"),
  layout: "template",
  viewExt: "ejs",
  cache: false,
  debug: true
})

//##########################Main
//##########################Main
router.get("/", async (ctx, next) => {
  let res = await fetch(
    "https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json"
  )

  let obj = {}
  obj = await res.json()

  menuObj = new Promise(function(resolve, reject) {
    fs.readFile("public/json/users.json", "utf8", function(err, dataRet) {
      if (err) reject(err)
      else resolve(dataRet)
    })
  })
  obj.users = JSON.parse(await menuObj)
  obj.users.map(data => (data.url = "player/" + data.name))
  await ctx.render("matches", obj)
})

//##########################player
//##########################player
router.get("/player/:id", async (ctx, next) => {
  let playerPmis = new Promise(function(resolve, reject) {
    fs.readFile("public/json/user/" + ctx.params.id + ".json", "utf8", function(err,dataRet) {
      if (err) reject(err)
      else resolve(dataRet)
    })
  })
  let teams = new Promise(function(resolve, reject) {
    fs.readFile("public/json/teams.json", "utf8", function(err, dataRet) {
      if (err) reject(err)
      else resolve(dataRet)
    })
  })
  let obj = {}
  obj = JSON.parse(await teams)
  obj.player = JSON.parse(await playerPmis)
  ctx.objScore = await func.calScore(obj.player)

  
  

  // if (ctx.path == '/favicon.ico'){
    // await next()
  // }
  

  menuObj = new Promise(function(resolve, reject) {
    fs.readFile("public/json/users.json", "utf8", function(err, dataRet) {
      if (err) reject(err)
      else resolve(dataRet)
    })
  })
  obj.users = JSON.parse(await menuObj)
  obj.users.map(data => (data.url = data.name))
  await ctx.render("player", obj)
})

//##########################chart
//##########################chart
router.get("/chart", async (ctx, next) => {
  menuObj = new Promise(function(resolve, reject) {
    fs.readFile("public/json/users.json", "utf8", function(err, dataRet) {
      if (err) reject(err)
      else resolve(dataRet)
    })
  })
  let obj = {}
  obj.users = JSON.parse(await menuObj)
  obj.users.map(data => (data.url = "player/" + data.name))
  obj.chartData = await createChart(obj)
  
  await ctx.render("chart", obj)
})



async function createChart(obj){
  let chart = {}
  chart.labels = []
  chart.datasets = []

  let chartUser
  // let colorNames = Object.keys(window.chartColors);
  // for (let i=0 ;i< obj.users.length; i++){
  //   chartUser = {}
  //   chartUser.label = obj.users[i].name
  //   chartUser.backgroundColor = [ obj.users[i].color]
  //   chartUser.data = [12]
  //   chart.datasets.push(chartUser)
  // }
  chartUser = {}
  chartUser.label = 'Player'
  chartUser.backgroundColor =[]
  chartUser.data =[]
  for (let i=0 ;i< obj.users.length; i++){
    chart.labels.push(obj.users[i].name)    
    chartUser.backgroundColor.push(obj.users[i].color)
    try {
      chartUser.data.push(await func.calScoreChart(obj.users[i].name)) 
    } catch (err) {
      chartUser.data.push(0)
    }    
  }
  chart.datasets.push(chartUser)
   
  return chart
} 

app.use(serve(path.join(__dirname, "public")))
app.use(router.routes())
// app.use(calcurateScore)
app.use(router.allowedMethods())
// console.log(`Boyyyy---Port : ${process.env.PORT}`)
app.listen(process.env.PORT || 3000)
// app.listen(3000)
