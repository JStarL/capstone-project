from backend.staff import Staff


class WaitStaff(Staff):
    def __init__(self, id, email, password):
        super().__init__(self, id, email, password)