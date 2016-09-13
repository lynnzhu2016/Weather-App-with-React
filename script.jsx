var Cards = React.createClass({

  getInitialState: function() {
    return {city: "",
            forecast: []
    };
  },  

  componentWillReceiveProps: function() {
    var component = this;
    var yqlQuery = "select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + this.props.city + "')"
    var url = "https://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(yqlQuery) + "&" + "format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
    
    $.get(url, function(data) {
      component.replaceState({city: data.query.results.channel.title,
	                          forecast: data.query.results.channel.item.forecast
      });
      component.refs.cardToday.replaceState({temp: data.query.results.channel.item.condition.temp,  
                                             text: data.query.results.channel.item.condition.text
      });
	
	  for(i=0; i < data.query.results.channel.item.forecast.length; i++){
	      component.refs[i].replaceState({day: data.query.results.channel.item.forecast[i].day,
										   date: data.query.results.channel.item.forecast[i].date,
										   high: data.query.results.channel.item.forecast[i].high,
										   low: data.query.results.channel.item.forecast[i].low,
										   text: data.query.results.channel.item.forecast[i].text
		  });
	  }                
    });
  },

  render: function() {
    var i=-1;
    var cards = this.state.forecast.map(function(day){
	    i++
		return (<Card ref={i} />);
	});
	if(this.state.city != ""){
		return (
			<div>
			<h2 className="title city">{this.state.city}</h2>
			<CardToday ref="cardToday"/>
			<h2 className="title">10-Day Forecast:</h2>
			<div className="forecast">
				{cards}
			</div>
			</div>
		);
	}else{
	    return(<div></div>);
	}
  }

});

var CardToday = React.createClass({
  getInitialState: function() {
    return {
	        temp: "",
			text: ""
	};
  },

  render: function() {
    return (
      <div>
		<div className="card today">
		  <div className="text">{this.state.text}</div>
		  <div className="temp">{this.state.temp + String.fromCharCode(176)}</div>
		</div>
      </div>
    );
  }
});

var Card = React.createClass({
  getInitialState: function() {
    return {day: "",
	        date: "",
			high: "",
			low: "",
			text: ""
	};
  },

  render: function() {
    return (
	  <div className="card">
		<div className="day">{this.state.day}</div>
		<div className="date">{this.state.date}</div>
		<div className="low-high">{this.state.high + String.fromCharCode(176) + "/" + this.state.low + String.fromCharCode(176)}</div>
		<div className="text">{this.state.text}</div>
      </div>
    );
  }
});

var Form = React.createClass({

  handleSubmit: function(e) {
    e.preventDefault();
    var cityInput = React.findDOMNode(this.refs.city);
	var city = cityInput.value.trim(); 

    if (city === "") {
        alert("Please enter city name");
        return;
    }
    city = city.replace("'", '"');
    this.props.setCity(city);
  },

  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input placeholder="City, State" ref="city" />
        <button>Check Weather</button>
      </form>
    );
  }

});

var Main = React.createClass({

  getInitialState: function() {
    return {city: ""};
  }, 

  setCity: function(cityToCheck){
	  this.setState({city: cityToCheck});
	  this.refs.cards.props.city = cityToCheck;
  },

  render: function() {
    return (
      <div>
        <Form setCity={this.setCity} />
		<Cards city={this.state.city} ref="cards"/>
      </div>
    )
  }

});

React.render(<Main />, document.getElementById("root"));

