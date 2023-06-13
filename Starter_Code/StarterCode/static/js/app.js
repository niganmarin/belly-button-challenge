// Fetch data from a remote source
var url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Load the data using D3 library
d3.json(url).then(function(data) {
  
  
    // Extract important information from the fetched data
  var names = data.names; 
  var metadata = data.metadata; 
  var samples = data.samples; 

  // Create a dropdown menu for selecting test subjects
  var dropdownMenu = d3.select("#selDataset"); 
  dropdownMenu.selectAll("option") 
    .data(names) 
    .enter() 
    .append("option") 
    .text(function(d) { 
      return d;
    });

  // Function to update the charts and metadata based on the selected test subject
  function updateCharts(selectedSample) {

    // Find the data for the selected test subject
    var selectedData = samples.find(function(sample) {
      return sample.id === selectedSample;
    });

    // Update the bar chart with the top 10 OTUs for the selected test subject
    var barData = [{
      x: selectedData.sample_values.slice(0, 10).reverse(), 
      y: selectedData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(), 
      text: selectedData.otu_labels.slice(0, 10).reverse(), 
      type: "bar", 
      orientation: "h" 
    }];
    Plotly.newPlot("bar", barData); 

    // Update the bubble chart with all OTUs for the selected test subject
    var bubbleData = [{
      x: selectedData.otu_ids, 
      y: selectedData.sample_values, 
      text: selectedData.otu_labels, 
      mode: "markers", 
      marker: {
        size: selectedData.sample_values, 
        color: selectedData.otu_ids, 
        colorscale: "Earth" 
      }
    }];
    Plotly.newPlot("bubble", bubbleData); 

    // Display the metadata for the selected test subject
    var selectedMetadata = metadata.find(function(sample) {
      return sample.id === parseInt(selectedSample);
    });
    displayMetadata(selectedMetadata);
  }

  // Function to display the metadata for the selected test subject
  function displayMetadata(metadata) {
    var metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html(""); // Clear existing content

    // Loop through each metadata key-value pair and display them
    Object.entries(metadata).forEach(([key, value]) => {
      metadataPanel.append("p").text(`${key}: ${value}`);
    });
  }

  // Event listener for dropdown change
  dropdownMenu.on("change", function() {
    var selectedSample = d3.select(this).property("value");
    updateCharts(selectedSample);
  });

  // Display initial charts and metadata
  var initialSample = names[0];
  updateCharts(initialSample);
}).catch(function(error) {
  console.error(error);
});
