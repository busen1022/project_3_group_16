function do_dashboard() {  // THIS NEED TO BE 2 FUNCTIONS???
    // Extract user input
    let min_stars = d3.select("#filter").property("value");
    min_stars = parseInt(min_stars);
    
    // Make url request
    let url_dashboard = `/api/v1.0/get_dashboard/${min_stars}`;
    d3.json(url_dashboard).then(function (data) {

    // Create the graphs
    make_donut(data.donut_data)
    make_table(data.table_data)
    make_map(data.map_data)
    });
}


function make_donut(filtered_data) {
    console.log(filtered_data)
    
    let top_5_data = filtered_data.sort((a, b) => b.count - a.count).slice(0, 5);

    // Extract the count and categories from the top 10 data array
    let donut_data = top_5_data.map(x => x.count);
    let donut_labels = top_5_data.map(x => x.categories);
    
    let custom_palette = ['#1e2067', '#694fbc', '#6b78de', '#90dbff', '#ffbf00']

    let trace1 = {
            values: donut_data,
            labels: donut_labels,
            type: 'pie',
            hoverinfo: 'label+percent',
            hole: 0.4,
            name: "Category Popularity",
            marker: {
                colors: custom_palette}
        }
    // // Create data array
    let data = [trace1];
    // // Apply a title to the layout
    let layout = {
        title: "Popular Food Groups",
        
    }
    Plotly.newPlot("donut_chart", data, layout);
}


function make_table(filtered_data) {
    // select table
    $('#data_table').DataTable().clear().destroy();

    let table = d3.select("#data_table");
    let table_body = table.select("tbody");
    table_body.html(""); 
  
    // create table
    for (let i = 0; i < filtered_data.length; i++){
      // get data row
      let data_row = filtered_data[i];
  
      // creates new row in the table
      let row = table_body.append("tr");
      row.append("td").text(data_row.name);
      row.append("td").text(data_row.address);
      row.append("td").text(data_row.category);
      row.append("td").text(data_row.stars);
      row.append("td").text(data_row.total_reviews);
    }

    $('#data_table').DataTable();
}

  

// Event Listener for Filter Click

d3.select("#filter").on("click", do_dashboard);




// Use default on first loading page

do_dashboard();

