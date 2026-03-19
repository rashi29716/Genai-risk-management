def calculate_risk(schedule_delay, payment_status, resource_count):

    delay_score = 1 if schedule_delay > 5 else 0.3
    payment_score = 1 if payment_status == "Pending" else 0
    resource_score = 1 if resource_count < 3 else 0.2

    risk = (0.4 * delay_score) + (0.3 * payment_score) + (0.3 * resource_score)

    if risk > 0.7:
        return "High"
    elif risk > 0.4:
        return "Medium"
    else:
        return "Low"