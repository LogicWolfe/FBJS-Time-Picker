/* MIT - Expat License
Copyright © Nathan Baxter
Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in 
the Software without restriction, including without limitation the rights to 
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

The Software is provided "as is", without warranty of any kind, express or 
implied, including but not limited to the warranties of merchantability, 
fitness for a particular purpose and noninfringement. In no event shall the 
authors or copyright holders be liable for any claim, damages or other 
liability, whether in an action of contract, tort or otherwise, arising from,
out of or in connection with the software or the use or other dealings in the
Software.*/

//Call TimePicker.start(clock_element) to begin, it is assumed that the previousSibling
//of clock element is your input field. If you wish to change that the selectValue function
//should be the only place that needs adjustment.
//The input element will be set with the time in the form [1-12]:[00|15|30|45] [AM|PM]
TimePicker = {
	currentHour: 0,
	currentMinute: 0,
	AMPM: 'AM',
	choices: {
		currentHour: [1,2,3,4,5,6,7,8,9,10,11,12],
		currentMinute: ['00','15','30','45'],
		AMPM: ['AM', 'PM']
	},
	start: function(element) {
		this.currentHour = 9;
		this.currentMinute = '00';
		this.AMPM = 'AM';
		this.element = element;
		var squares = this.buildSquares();
		squares.setStyle(this.widgetStyles);
		if (element.getNextSibling()) {
			element.getParentNode().insertBefore(squares, element.getNextSibling());
		} else {
			element.getParentNode().appendChild(squares);
		}
	},
	buildSquares: function() {
		var squares = document.createElement('div');
		squares.addEventListener('click', function() {TimePicker.finish();}, true);
		var lastRow = squares;
		for (var key in this.choices) {
			var newRow = this.buildRow(key, this.choices[key]);
			lastRow.appendChild(newRow);
			lastRow = newRow;
		}
		squares.setClassName('time_picker');
		this.timePickerElement = squares;
		return squares;
	},
	buildRow: function(name, labels) {
		var row = document.createElement('div');
		for (var i=0;i<labels.length;i++) {
			row.appendChild(this.buildSquare(name, i, labels[i]));
		}
		row.setClassName('row');
		return row;
	},
	buildSquare: function(rowName, index, value) {
		var square = document.createElement('div');
		square.setTextValue(value);
		square.setName(rowName+','+index);
		square.setClassName('square');
		var that = this;
		square.addEventListener('mouseover', function() {that.selectSquare(square);}, true);
		return square;
	},
	selectSquare: function(element) {
		var row = element.getParentNode().getChildNodes();
		var offsetLeft = 0;
		var matched = false;
		for (var i=0; i<row.length; i++) {
			if (matched != true && row[i] != element) {
				offsetLeft += row[i].getOffsetWidth();
			} else if (matched != true) {
				matched = true;
			}
			row[i].removeClassName('selected');
		}
		element.addClassName('selected');

		var selectedPosition = element.getName().split(',');
		this.selectValue(selectedPosition[0], parseInt(selectedPosition[1],10));
		if (element.getParentNode().getLastChild().hasClassName('row')) {
			var nextRow = element.getParentNode().getLastChild();
			nextRow.setStyle({
				position: 'relative',
				left: offsetLeft + 'px'
			});
		}
	},
	selectValue: function(row, position) {
		this[row] = this.choices[row][position];
		this.element.getPreviousSibling().setValue(this.currentHour + ":" + this.currentMinute + ' ' + this.AMPM);
	},
	finish: function() {
		this.timePickerElement.getParentNode().removeChild(this.timePickerElement);
	}
};