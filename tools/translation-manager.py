#!/usr/bin/env python3

import fire
import json
import csv

from typing import Dict

def flatten(dict: Dict, prefix=""):
  """Flattens a dictionary into a list of string tuples"""
  flat = []
  for k, v in dict.items():
    key = k if prefix == '' else f"{prefix}.{k}"
    if isinstance(v, str):
      flat.append((key, v))
    else:
      flat.extend(flatten(v, prefix=key))
  return flat

def unflatten(dict: Dict, keySegments, value):
  if len(keySegments) == 0:
    return

  key = keySegments[0]
  if len(keySegments) == 1:
    dict[key] = value
  else:
    if key not in dict:
      dict[key] = {}
    unflatten(dict[key], keySegments[1:], value)


class TranslationManager(object):
  """Handles import and export of locale files into the translation spreadsheet"""
  def exportJSON(self, locale="en"):
    """"""
    with open(f'../web/src/i18n/locales/{locale}.json') as json_file: 
      input = json.load(json_file) 

    output = open(f"{locale}.csv", 'w')
    
    # create the csv writer object 
    csv_writer = csv.writer(output) 
    
    pairs = flatten(input)

    csv_writer.writerow(["key", locale])
    for p in pairs:
      csv_writer.writerow(p)
    
    output.close()
    
  def importCSV(self, file):
    data = {}
    locale = 'en'

    with open(file, encoding='utf-8') as csv_file:
      csvReader = csv.DictReader(csv_file) 

      # Convert each row into a dictionary  
      # and add it to data 
      for rows in csvReader:
        keySegments = rows['key'].split('.')
        unflatten(data, keySegments, rows[locale])

    # TODO: Alphabetize items
    with open(f"{locale}.json", 'w', encoding='utf-8') as json_file: 
      json_file.write(json.dumps(data, indent=4)) 

if __name__ == '__main__':
  fire.Fire(TranslationManager)
