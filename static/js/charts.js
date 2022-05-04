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
  function buildCharts(SubjectID) {
    // Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // Create a variable that holds the samples array. 
      var sample = data.samples;
      // Create a variable that filters the samples for the object with the desired sample number.
      var sampleArray = sample.filter(sampleObj => sampleObj.id == SubjectID);
  
      //  Create a variable that holds the first sample in the array.
      var result = sampleArray[0];
  
      // Create variables that hold the otu_ids, otu_labels, and sample_values.
  var otu_id = result.otu_ids;
  var otu_labels = result.otu_labels;
  var sample_values = result.sample_values;
  
      // Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
      var yticks = otu_id.slice(0, 10).map(id => `OTU ${id}`).reverse();
      var xvals = sample_values.slice(0, 10).reverse();
  
          // BAR CHART
          // Create the trace
          var bar_data = [{
            // Use otu_ids for the x values
            x: xvals,
            // Use sample_values for the y values
            y: yticks ,
            // Use otu_labels for the text values
            text: otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h'
        }];
  
        // Define plot layout
        var bar_layout = {
            title: "<b>Top 10 Bacteria Cultures Found</b>",
            autosize: false,
            automargin: true,
            width: 500,
            height: 500,
            paper_bgcolor: '#F0F8FF',
            plot_bgcolor: '#F0F8FF'
          };
  
        // Display plot
        Plotly.newPlot('bar', bar_data, bar_layout)
  
        // Create the trace for the bubble chart.
        var bubbleData = [{
        x : otu_id,
        y : sample_values,
        text : otu_labels,
        mode : 'markers',
        color: 'Portland',
        marker : {
          color : otu_id,
          size: sample_values,
          colorscale: 'Portland'
        } 
        }];
    
        // Create the layout for the bubble chart.
        var bubbleLayout = {
          title: "<b>Bacteria Cultures Per Sample</b>",
          xaxis: { title: "OTU IDs" },
          autosize: false,
          automargin: true,
          width: 1200,
          height: 500,
          paper_bgcolor: '#F0F8FF',
          plot_bgcolor: '#F0F8FF'
        };
    
        // Use Plotly to plot the data with the layout.
        Plotly.newPlot('bubble', bubbleData, bubbleLayout); 
  
            // Create a variable that holds the metada array. 
      var metadata = data.metadata;
      // Create a variable that filters the metadata for the object with the desired sample number.
      var metadataArray = metadata.filter(sampleObj => sampleObj.id == SubjectID);
  
      //  Create a variable that holds the first metadata in the array.
      var result2 = metadataArray[0];
  
            // Create the trace for the gauge chart.
      var gaugeData = [{
        domain: { x: [0, 1], y: [0, 1] },
        value: parseFloat(result2.wfreq),
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
      var gaugeLayout = { 
        title: "<b>Belly Button Washing Frequency (Scrubs per Week)</b>",
        autosize: false,
        automargin: true,
        width: 500,
        height: 500,
        paper_bgcolor: '#F0F8FF',
        plot_bgcolor: '#F0F8FF'
       
      };
  
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot('gauge', gaugeData, gaugeLayout);
      });
  };