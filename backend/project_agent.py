def analyze_project(project):

    risks = []

    if project["schedule_delay"] > 5:
        risks.append("Schedule Delay")

    if project["payment_status"] == "Pending":
        risks.append("Payment Risk")

    if project["resource_count"] < 3:
        risks.append("Resource Shortage")

    return risks