{
  "name": "Residence",
  "type": "object",
  "properties": {
    "building_name": {
      "type": "string",
      "title": "Building Name"
    },
    "building_address": {
      "type": "string",
      "title": "Building Address"
    },
    "number_of_units": {
      "type": "number",
      "title": "Number of Units"
    },
    "numbering_format": {
      "type": "string",
      "title": "Numbering Format",
      "enum": [
        "numeric",
        "alphanumeric_letter_first",
        "alphanumeric_number_first"
      ],
      "enumNames": [
        "Numeric (101, 102...)",
        "Letter First (A1, A2...)",
        "Number First (1A, 1B...)"
      ]
    },
    "numbering_start": {
      "type": "string",
      "title": "First Unit Number/Label"
    },
    "manager_name": {
      "type": "string",
      "title": "Manager Name"
    },
    "manager_email": {
      "type": "string",
      "title": "Manager Email"
    },
    "manager_phone": {
      "type": "string",
      "title": "Manager Phone"
    },
    "emergency_contacts": {
      "type": "string",
      "title": "Emergency Contacts"
    },
    "max_visitors": {
      "type": "number",
      "title": "Max Visitors at a Time"
    },
    "sleepover_fee": {
      "type": "number",
      "title": "Sleepover Fee (R)"
    },
    "house_rules_url": {
      "type": "string",
      "title": "House Rules PDF URL"
    },
    "security_code": {
      "type": "string",
      "title": "Security Code"
    },
    "student_code_limit": {
      "type": "number",
      "title": "Student Code Limit"
    },
    "subscription_status": {
      "type": "string",
      "title": "Subscription Status",
      "enum": [
        "active",
        "inactive",
        "pending"
      ],
      "default": "pending"
    },
    "subscription_expires_at": {
      "type": "string",
      "title": "Subscription Expires At"
    },
    "monthly_total": {
      "type": "number",
      "title": "Monthly Total (R)"
    },
    "payment_status": {
      "type": "string",
      "title": "Payment Status",
      "enum": [
        "paid",
        "unpaid",
        "pending"
      ],
      "default": "pending"
    }
  },
  "required": [
    "building_name",
    "building_address",
    "number_of_units",
    "manager_name",
    "manager_email",
    "manager_phone"
  ]
}