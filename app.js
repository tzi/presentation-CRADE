App = (function App() {

    // Initialization
    var editor = ace.edit("editorFrame");
    editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/javascript");
    QUnit.testDone(function(details){
        addTestReport(details.name, details.failed==0);
    });

    // Private
    cleanTestReport = function() {
        document.getElementById('testFrame').innerHTML = '';
    }
    addTestReport = function(name, result) {
        document.getElementById('testFrame')
            .innerHTML += '<span class="test">'
            + '<span class="test-name">' + name +'</span>: '
            + '<span class="test-result test-result--' + (result?'ok':'error') + '">' + (result?'OK':'ERROR') + '</span>'
            + '</span>';
    }
    toggleTestReport = function(action) {
        var method;
        if (typeof action == 'object' || typeof action == 'undefined') {
            action = false;
            method='toggle';
        } else if (action) {
            method='add';
        } else {
            method='remove';
        }
        var result = document.getElementById('mainFrame').classList[method]('showTest');
        var button = document.getElementById('showTestButton');
        if (result || action) {
            button.innerHTML = 'Hide tests';
        } else {
            button.innerHTML = 'Show tests';
        }
    }

    return {
        toggleTestReport: function(action) {
            toggleTestReport(action);
        },
        runTests: function() {
            var js = editor.getValue();
            try {
                eval(js);
            } catch(e) {
                alert('Error in javascript compilation');
                return false;
            }
            cleanTestReport();
            toggleTestReport(true);
            QUnit.reset();
            QUnit.init();
            QUnit.start();
            TestSuite(js);
        },
        init: function(val) {
            editor.setValue(val);
        }
    }
})();

// Menu
var showTestButton = document.getElementById('showTestButton');
showTestButton.addEventListener('click', App.toggleTestReport);
var runTestButton = document.getElementById('runTestButton');
runTestButton.addEventListener('click', App.runTests);

