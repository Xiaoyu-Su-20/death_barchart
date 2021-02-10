// function for importing data from the csv file 

import React, { useState, useEffect } from 'react';
import { csv } from 'd3';

const csvUrl =
  'data.csv';

export const useData = () => {
  const [data, setData] = useState(null);

	useEffect( () => {
  	const row = d => {
      // "+" turns strings into numbers 
    	d.value = +d.value
  	return d;
    };
    csv(csvUrl, row).then(setData);
}, []);
  return data;
};