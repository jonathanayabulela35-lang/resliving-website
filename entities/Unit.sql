{
  "name": "Unit",
  "type": "object",
  "properties": {
    "residence_id": {
      "type": "string",
      "title": "Residence ID"
    },
    "unit_label": {
      "type": "string",
      "title": "Unit Label"
    },
    "unit_code": {
      "type": "string",
      "title": "Unit Code"
    },
    "is_active": {
      "type": "boolean",
      "title": "Is Active",
      "default": true
    }
  },
  "required": [
    "residence_id",
    "unit_label",
    "unit_code"
  ]
}