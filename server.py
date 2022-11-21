'''
Date: 29/01/19
Author: MDC
Version: 1.2

Server to receive and execute Python code from the Block environment
'''

#import SimpleHTTPServer
#import SimpleXMLRPCServer

import http.server as SimpleHTTPServer
import xmlrpc.server as SimpleXMLRPCServer
import os, threading, sys, time

# Nasty global variables
_thread_running_ = False # Used to keep track of whether a program is running or not
_lineOfExecution_ = 0 # Used for thread communication of the line of execution
threadLog = ""
origStdOut = ""
currentWorkingDir = None
web_dir = None
# End global variables

class threadStdIO:
    def __init__(self):
        self.content = ""
        self.inStream = ""
        self.inStreamResponse = ""
    def write(self, value):
        pushMsg = True
        # Filter out the server messages
        if len(value) > 9:
            if value[0:9] == "127.0.0.1":
                pushMsg = False
        # Filter out the threading stuff on the stdErr msg
        if len(value) > 285:
            if value[0:9] == "Exception":
                exceptionMsg = value.split(",")
                value = exceptionMsg[len(exceptionMsg)-1]
                # Alter the relative line number for errors
                findLineNum = value.split(" ")
                if findLineNum[1] == "line":
                    findLineNum[2] = str(int((int(findLineNum[2]) - 2) / 2))
                    value = " "
                    for item in findLineNum:
                        value += item + " "
        # Push the message
        if pushMsg == True:
            self.content += str(value) + "~$%"
    def readline(self):
        # input function seems to result in stdIn.readline
        self.inStream = "True"
        while self.inStreamResponse == "" and _thread_running_ == True:
            pass
        if _thread_running_ == False:
            self.inStreamResponse = "Terminated"     
        userIO = self.inStreamResponse
        self.inStreamResponse = ""
        self.write("\n")
        return userIO
    def flusher(self):
        self.content = ""
        self.inStream = ""
        self.inStreamResponse = ""
        # Sometimes due to program ending in Exception the stdOut, strdErr, stdIn may have returned to console
        # Redo the redirection
        sys.stdout = threadLog
        sys.stderr = threadLog
        sys.stdin = threadLog

'''
    receiveCode - receives a complete program from an XMLRPC call and starts it running
'''
       
def receiveCode(code):
    global _thread_running_, _lineOfExecution_, origStdOut, threadLog, currentWorkingDir
    _thread_running_ = False # Used to keep track of whether a program is running or not
    _lineOfExecution_ = 0 # Used for thread communication of the line of execution
    injectedCode = ""
    for thisLine in code:
        injectedCode += "\n" + thisLine
    injectedCode += "\n" + "_thread_running_ = False\n"
    injectedCode += "os.chdir(web_dir)"   # Put the working directory back to the web server dir
    
    def runCode():
        os.chdir(currentWorkingDir) # Set the working directory to the cwd when this script was launched. Needed for filehandling.
        exec(injectedCode, globals())
        
    t = threading.Thread(target=runCode)
       
    threadLog.flusher()
    
    time.sleep(0.2)
    _thread_running_ = True
    t.start()
    return "running"

def returnStatus():
    global _thread_running_, _lineOfExecution_
    returnThis = [_thread_running_, _lineOfExecution_, threadLog.inStream, threadLog.content]
    threadLog.inStream = ""
    threadLog.content = ""
    if _thread_running_ == False:
        stopRunning()   # Reset the working directory
    return returnThis

def stopRunning():
    global _thread_running_, _lineOfExecution_, origStdOut, threadLog, web_dir
    _thread_running_ = False
    os.chdir(web_dir)   # Put the working directory back to the web server dir
    return [_thread_running_, _lineOfExecution_]

def processUserIO(userIO):
    threadLog.inStreamResponse = userIO;
    return "Thank you"

def registerXmlRpcMethods(server):
    
    # Register standard XML-RPC methods.
    server.register_introspection_functions()
    
    # Register the function to receive the code
    server.register_function(receiveCode,'receiveCode')
    # Register the function that returns the status of the running program
    server.register_function(returnStatus,'returnStatus')
    # Register the function that stops the running program
    server.register_function(stopRunning,'stopRunning')
    # Register the function that returns the input from user
    server.register_function(processUserIO,'processUserIO')
        
    
# We define a custom server request handler, capable of both handling GET and XML-RPC requests.
class RequestHandler(SimpleXMLRPCServer.SimpleXMLRPCRequestHandler, SimpleHTTPServer.SimpleHTTPRequestHandler):
    rpc_paths = ('/pythonServer',)

    def do_GET(self):
        SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)      
    
    
# Start running the server ...    
if __name__ == "__main__":
    # Set up redirection of stdOut, stdErr and stdIn
    threadLog = threadStdIO()
    origStdOut = sys.stdout
    origStdErr = sys.stderr
    origStdIn = sys.stdin
    
    sys.stdout = threadLog
    sys.stderr = threadLog
    sys.stdin = threadLog
    
    # Create our XML-RPC server.using our custom request handler that is also able to serve web pages over GET.
    port = 8081
    server = SimpleXMLRPCServer.SimpleXMLRPCServer(("", port), RequestHandler)
    
    # Register the XML-RPC methods ...
    registerXmlRpcMethods(server)

    currentWorkingDir = os.getcwd() # Store the current working directory - used to set the dir for the child process
    ##currentWorkingDir = os.path.join(currentWorkingDir, "Downloads")
    web_dir = os.path.join(os.path.dirname(__file__), '.')
    os.chdir(web_dir)   # The webserver needs to serve from the working directory
    
    # Start to server.
    server.serve_forever()
