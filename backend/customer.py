from backend.staff import Staff


class Customer(Staff):
    def __init__(self, id, email, password):
        super().__init__(self, id, email, password)

    def customer_view_menu():