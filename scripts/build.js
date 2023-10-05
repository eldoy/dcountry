#!/usr/bin/env node

var fs = require('node:fs')
var list = require('country-data-list')
var countries = list.countries.all
var continents = list.continents
var languages = list.languages
var regions = list.regions

var data = []
for (var key in countries) {
  var country = countries[key]
  country.iso2 = (country.alpha2 || '').toUpperCase()
  country.iso3 = (country.alpha3 || '').toUpperCase()
  country.calls = country.countryCallingCodes
  country.flag = country.emoji
  delete country.alpha2
  delete country.alpha3
  delete country.countryCallingCodes
  delete country.emoji

  country.lang = country.languages.map((lang) => {
    var language = languages[lang]
    language.bibliographic = (language.bibliographic || '').toUpperCase()
    language.iso2 = (language.alpha2 || '').toUpperCase()
    language.iso3 = (language.alpha3 || '').toUpperCase()
    delete language.alpha2
    delete language.alpha3
    return language
  })
  delete country.languages
  data.push(countries[key])
}

// Add continents
for (var key in continents) {
  var continent = continents[key]
  for (var code of continent.countries) {
    var country = data.find((x) => x.iso2 == code)
    country.continent = continent.name
  }
}

// Add regions
for (var name in regions) {
  var region = regions[name]
  for (var code of region.countries) {
    var country = data.find((x) => x.iso2 == code)
    country.region = region.name
  }
}

var result = JSON.stringify(data, null, 2)
fs.writeFileSync('./countries.json', result)
