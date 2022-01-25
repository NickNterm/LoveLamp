#include <DNSServer.h>
#include <WiFi.h>
#include "ESPAsyncWebServer.h"
#include "EEPROM.h"
#include <ArduinoJson.h>
#include <HTTPClient.h>

DNSServer dnsServer;
AsyncWebServer server(80);

String WifiSSID;
String WifiPassword;
String ServerUrl;
bool SSIDReceived = false;
bool PasswordReceived = false;
String Mode = "setup";

bool LEDstatus = false;
//#define PIN_RED    21
//#define PIN_GREEN  22
//#define PIN_BLUE   23
//#define TOUCH_PIN  15
#define PIN_RED    13
#define PIN_GREEN  14
#define PIN_BLUE   15
#define TOUCH_PIN  12
int r = 255;
int g = 0;
int b = 0;

String token = "DemonLamp";
String password = "asemenampore";
//String token = "asdfasdf";
//String password = "pass";

unsigned long lastTime = 0;
unsigned long timerDelay = 10000;

char* index_html PROGMEM = R"rawliteral(<!DOCTYPE HTML>
    <html>
    
    <head>
        <title>Smart Lamp Connect</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    
    <body>
        <h3 style="text-align: center;">Wifi Connection</h3>
        <br><br>
        <form action="/get" style="align-self: center; width: 90%; margin: auto;" required>
            <div style="text-align: center;">
                Name: <input type="text" name="SSID" style="border-radius: 4px; border: 1px solid;">
                </div>
            <div style="text-align: center; margin-top: 5px; margin-bottom: 10px;">
                Password: <input type="text" name="Password" style="border-radius: 4px; border: 1px solid;" required>
            </div>
            <div style="text-align: center; margin-top: 5px; margin-bottom: 10px;">
                Server: <input type="text" name="Server" style="border-radius: 4px; border: 1px solid;" value='http://130.185.234.70:3336/SmartHouse' required>
            </div>
            <input type="submit"
                style="
                background-color: #37a4ed; 
                border: 0; 
                border-radius: 10px; 
                width: 30%; 
                align-items: center; 
                padding: 8px; 
                color: #fff; 
                font-weight: bold;
                display: block; 
                margin-right: auto; 
                margin-left: auto;"
                value="Connect">
        </form>
    </body>
    
    </html>)rawliteral";

class CaptiveRequestHandler : public AsyncWebHandler {
  public:
    CaptiveRequestHandler() {}
    virtual ~CaptiveRequestHandler() {}

    bool canHandle(AsyncWebServerRequest *request) {
      return true;
    }

    void handleRequest(AsyncWebServerRequest *request) {
      request->send_P(200, "text/html", index_html);
    }
};


void setup() {
  Serial.begin(115200);
  Serial.println();
  Serial.println("Start");

  ledcSetup(1, 12000, 8);
  ledcSetup(2, 12000, 8);
  ledcSetup(3, 12000, 8);

  ledcAttachPin(PIN_RED, 1);
  ledcAttachPin(PIN_GREEN, 2);
  ledcAttachPin(PIN_BLUE, 3);

  EEPROM.begin(512);
  if (touchRead(TOUCH_PIN) < 40) {
    for (int i = 0; i < 255; i++) {
      EEPROM.write(i, 0);
      writeColor(LEDstatus * 255, 0, 0);
      LEDstatus = ! LEDstatus;
      delay(5);
    }
    EEPROM.commit();
    ESP.restart();
  }
  if (EEPROM.read(0) == 0) {
    WiFi.mode(WIFI_AP);
    WiFi.softAP("Smart_Lamp");

    setupServer();
    dnsServer.start(53, "*", WiFi.softAPIP());
    server.addHandler(new CaptiveRequestHandler()).setFilter(ON_AP_FILTER);
    server.begin();
  } else {
    Mode = "other";
    WifiSSID = readStringFromEEPROM(0);
    WifiPassword = readStringFromEEPROM(WifiSSID.length() + 1);
    ServerUrl = readStringFromEEPROM(WifiSSID.length() + WifiPassword.length() + 2);

    WiFi.mode(WIFI_STA);

    char ssid[WifiSSID.length() + 1];
    WifiSSID.toCharArray(ssid, WifiSSID.length() + 1);

    char pass[WifiPassword.length() + 1];
    WifiPassword.toCharArray(pass, WifiPassword.length() + 1);

    WiFi.begin(ssid, pass);

    long starttime = millis();
    while (WiFi.status() != WL_CONNECTED) {
      fadeAnimation();
      if (millis() - starttime > 30000) {
        break;
      }
      delay(10);
    }

    if (WiFi.status() != WL_CONNECTED) {
      for (int i = 0; i < 255; i++) {
        EEPROM.write(i, 0);
        writeColor(LEDstatus * 255, 0, 0);
        LEDstatus = ! LEDstatus;
        delay(5);
      }
      EEPROM.commit();
      ESP.restart();
    } else {
      writeColorWithFade(0, 255, 0);
      for (int i = 0 ; i < 5; i++) {
        writeColor(0, 255, 0);
        delay(100);
        writeColor(0, 0, 0);
        delay(100);
      }
      writeColor(0, 255, 0);
    }
  }
}

void loop() {
  if (Mode == "setup") {
    fadeAnimation();
    delay(2);
    dnsServer.processNextRequest();
    if (SSIDReceived && PasswordReceived) {
      writeColor(0, 255, 0);
      writeStringToEEPROM(0, WifiSSID);
      writeStringToEEPROM(WifiSSID.length() + 1, WifiPassword);
      writeStringToEEPROM(WifiSSID.length() + WifiPassword.length() + 2, ServerUrl);
      EEPROM.commit();
      delay(1000);
      ESP.restart();
    } else {

    }
  } else {
    if ((millis() - lastTime) > timerDelay) {
      if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;

        String serverPath = ServerUrl + "/" + token + "/" + password + "/";

        http.begin(serverPath.c_str());

        int httpResponseCode = http.GET();

        if (httpResponseCode > 0) {
          DynamicJsonDocument doc(1024);
          String payload = http.getString();
          Serial.println(payload);
          deserializeJson(doc, payload);
          writeColorWithFade(doc["R"], doc["G"], doc["B"]);
        }
        http.end();
        esp_sleep_enable_timer_wakeup(9000);
      }
      lastTime = millis();
    }
  }
}

void fadeAnimation() {
  if (r > 0 && b == 0) {
    r--;
    g++;
  }
  if (g > 0 && r == 0) {
    g--;
    b++;
  }
  if (b > 0 && g == 0) {
    r++;
    b--;
  }
  writeColor(r, g, b);
}

void writeStringToEEPROM(int addrOffset, const String &strToWrite)
{
  byte len = strToWrite.length();
  EEPROM.write(addrOffset, len);
  for (int i = 0; i < len; i++)
  {
    EEPROM.write(addrOffset + 1 + i, strToWrite[i]);
  }
}

String readStringFromEEPROM(int addrOffset)
{
  int newStrLen = EEPROM.read(addrOffset);
  char data[newStrLen + 1];
  for (int i = 0; i < newStrLen; i++)
  {
    data[i] = EEPROM.read(addrOffset + 1 + i);
  }
  data[newStrLen] = '\0';
  return String(data);
}

void writeColor(int r, int g, int b) {
  ledcWrite(1, r);
  ledcWrite(2, g);
  ledcWrite(3, b);
  /*
    if (r < 3) {
    ledcWrite(1, 256);
    }
    if (g < 3) {
    ledcWrite(2, 256);
    }
    if (b < 3) {
    ledcWrite(3, 256);
    }*/
}
void writeColorWithFade(int red, int green, int blue) {

  while (r != red || g != green || b != blue) {
    if (r > red) {
      r--;
    }
    if (r < red) {
      r++;
    }
    if (g > green) {
      g--;
    }
    if (g < green) {
      g++;
    }
    if (b > blue) {
      b--;
    }
    if (b < blue) {
      b++;
    }
    writeColor(r, g, b);
    delay(10);
  }
}

void setupServer() {
  server.on("/", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send_P(200, "text/html", index_html);
  });

  server.on("/get", HTTP_GET, [] (AsyncWebServerRequest * request) {
    String inputMessage;
    String inputParam;

    if (request->hasParam("SSID")) {
      inputMessage = request->getParam("SSID")->value();
      inputParam = "SSID";
      WifiSSID = inputMessage;
      SSIDReceived = true;
    }

    if (request->hasParam("Password")) {
      inputMessage = request->getParam("Password")->value();
      inputParam = "Password";
      WifiPassword = inputMessage;
      PasswordReceived = true;
    }

    if (request->hasParam("Server")) {
      inputMessage = request->getParam("Server")->value();
      inputParam = "Server";
      ServerUrl = inputMessage;
    }
    request->send(200, "text/html", "Your Wifi is set Please wait...");
  });
}
