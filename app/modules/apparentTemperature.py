from .temperature import Temperature

class ApparentTemperature(Temperature):

    def __init__(self):

        super().__init__()
        self.elementName = "elementName=AT"