from django.db import models

class Staff(models.Model):
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    phone = models.CharField(max_length=15)
    salary = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name
    
class Attendance(models.Model):
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(
        max_length=10,
        choices=[
            ("present","Present"),
            ("absent","Absent"),
        ]
    )

    def __str__(self):
        return f"{self.staff.name}-{self.date}"