function loadSamples() {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
      .then(function(data) {
        // The JSON data will be available in the 'data' variable
        console.log(data);
        // Continue with further processing or visualization
      })
      .catch(function(error) {
        // Handle any error that occurs during fetching the JSON data
        console.error(error);
      });
  }

  loadSamples();

  
  // Load and process the data
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
.then(function(data) {
  // Extract required data for the bar chart
  var samples = data.samples;
  var dropdown = d3.select("#selDataset");
  var chartContainer = d3.select("#bar-chart");

  // Populate dropdown menu with sample IDs
  samples.forEach(function(sample) {
    dropdown
      .append("option")
      .text(sample.id)
      .property("value", sample.id);
  });

  // Call updateChart() when dropdown value changes
  dropdown.on("change", function() {
    var selectedSample = dropdown.property("value");
    updateChart(selectedSample);
  });

  // Initial chart display
  var initialSample = dropdown.property("value");
  updateChart(initialSample);
})
.catch(function(error) {
  console.error(error);
});

function updateChart(selectedSample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
      .then(function(data) {
        var samples = data.samples;
        var selectedData = samples.find(function(sample) {
          return sample.id === selectedSample;
        });
  
        // Extract top 10 OTUs data
        var otuValues = selectedData.sample_values.slice(0, 10).reverse();
        var otuIds = selectedData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
        var otuLabels = selectedData.otu_labels.slice(0, 10).reverse();
  
        // Create the bar chart
        var trace = {
          x: otuValues,
          y: otuIds,
          text: otuLabels,
          type: "bar",
          orientation: "h"
        };
  
        var layout = {
          title: "Top 10 OTUs",
          xaxis: { title: "Sample Values" },
          yaxis: { title: "OTU IDs" }
        };
  
        var chartData = [trace];
  
        Plotly.newPlot("bar", chartData, layout);
      })
      .catch(function(error) {
        console.error(error);
      });
  }
  