# text recognition
import cv2
import pytesseract
import sys
# read image
fileName = sys.argv[1]
print("filename recieved from node", fileName)
img = cv2.imread('ear8.jpg')

# configurations
config = ('-l eng --oem 1 --psm 6')

# pytessercat
pytesseract.pytesseract.tesseract_cmd = 'C:/Program Files/Tesseract-OCR/tesseract.exe'
text = pytesseract.image_to_string(img, config=config)

print(text)
text = text.split('\n')
print(text)
print('Hello w0rld')
sys.stdout.flush()
