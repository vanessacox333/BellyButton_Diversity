console.log(cityGrowths);

var sortedCities_ascending = cityGrowths.sort(
    (a,b) =>
    a.Increase_from_2016 - b.Increase_from_2016);
console.log(sortedCities_ascending);

var sortedCities = cityGrowths.sort(
    (a,b) =>
    a.Increase_from_2016 - b.Increase_from_2016).reverse();
console.log(sortedCities);

var topFiveCities = sortedCities.slice(0,5);
console.log(topFiveCities);

var topFiveCityNames = cityGrowths.map(city => city.City);
console.log(topFiveCityNames)
var topFiveCityGrowths = cityGrowths.map(city => parseInt(city.Increase_from_2016));
console.log(topFiveCityGrowths)


var trace = {
    x: topFiveCityNames,
    y: topFiveCityGrowths,
    type: "bar"
  };
  var data = [trace];
  var layout = {
    title: "Most Rapidly Growing Cities",
    xaxis: {title: "City" },
    yaxis: {title: "Population Growth, 2016-2017"}
  };
  Plotly.newPlot("bar-plot", data, layout);

