function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildMetadata(firstSample);
      buildCharts(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  };
  
  // Create the buildCharts function.
  function buildCharts(subjectID) {
    // Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // Create a variable that holds the samples array. 
      var sample = data.samples;
      // Create a variable that filters the samples for the object with the desired sample number.
      var sampleArray = sample.filter(sampleObj => sampleObj.id == subjectID);
  
      //  Create a variable that holds the first sample in the array.
      var result = sampleArray[0];
  
      // Create variables that hold the otu_ids, otu_labels, and sample_values.
  var OTU_id = result.otu_ids;
  var OTU_labels = result.otu_labels;
  var sample_vals = result.sample_values;
  
      // Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
      var yticks = sample_vals.slice(0, 10).map(id => `OTU ${id}`).reverse();
      var xvalues = OTU_id.slice(0, 10).reverse()
  
          // BAR CHART
          // Create the trace
          var bar_data = {
            x: xvalues,
            y: yticks ,
            text: OTU_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h'
        };
  
        // Define plot layout
        var bar_layout = {
            title: "Top 10 Bacteria Cultures Found"
        };
  
        // Display plot
        Plotly.newPlot('bar', [bar_data], bar_layout)
  
        // Create the trace for the bubble chart.
        var bubbleData = {
        x : OTU_id,
        y : Sample_Values,
        text : labels,
        mode : 'markers',
        marker : {
          color : OTU_id,
          size: Sample_Values
        } 
        };
    
        // Create the layout for the bubble chart.
        var bubbleLayout = {
          title: "<b>Bacteria Cultures Per Sample</b>",
          xaxis: { title: "OTU IDs" },
        };
    
        // Use Plotly to plot the data with the layout.
        Plotly.newPlot('bubble', [bubbleData], bubbleLayout); 
  
            // Create a variable that holds the metada array. 
      var metadata = data.metadata;
      // Create a variable that filters the metadata for the object with the desired sample number.
      var metadataArray = metadata.filter(sampleObj => sampleObj.id == subjectID);
  
      //  Create a variable that holds the first metadata in the array.
      var result2 = metadataArray[0];
  
            // Create the trace for the gauge chart.
      var gaugeData = [{
        domain: { x: [0, 1], y: [0, 1] },
        value: parseFloat(result2.wfreq),
        title: { text: "Belly Button Washing Frequency (Scrubs per Week)" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          bar: {color: 'black'},
          axis: { range: [null, 9] },
          steps: [
              { range: [0, 2], color: 'red' },
              { range: [2,4], color: 'orange' },
              { range: [4,6], color: 'yellow' },
              { range : [6,8], color: 'yellowgreen'},
              { range : [8,9], color: 'green'}
          ],
      }}
       
      ];
      
      // 5. Create the layout for the gauge chart.
      var gaugeLayout = { width: 600, height: 450, margin: { t: 0, b: 0 }
       
      };
  
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot('gauge', gaugeData, gaugeLayout);
      });
  };