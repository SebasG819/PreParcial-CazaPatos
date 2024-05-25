  // Declaraciones de variables para contar los clics y disparos
  int clickCountRight = 0;
  int clickCountLeft = 0;
  int shotting = 0;

  // Pines de los botones
  int pinBOTON1 = 4;
  int pinBOTON2 = 2;
  int pinBOTON3 = 2;

  void setup() {
    Serial.begin(9600);
    Serial.println("Arduino Server Started");

    // Configuración de los pines de los botones como entradas
    pinMode(pinBOTON1, INPUT);
    pinMode(pinBOTON2, INPUT);
    pinMode(pinBOTON3, INPUT);
  }

  void loop() {
    // Lectura y manejo del botón derecho
    if (digitalRead(pinBOTON1) == HIGH) {
      clickCountRight++;
      Serial.print("click Derecho");
      Serial.println(clickCountRight);
    }

    // Lectura y manejo del botón de disparo
    if (digitalRead(pinBOTON2) == HIGH) {
      Serial.print("Disparaste");
    }

    // Lectura y manejo del botón izquierdo
    if (digitalRead(pinBOTON3) == HIGH) {
      clickCountLeft++;
      Serial.print("click Izquierdo");
      Serial.println(clickCountLeft);
    }

    delay(0); // Pequeña pausa para estabilizar la lectura de los botones
  }



 