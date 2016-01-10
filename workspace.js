/* global cpdefine chilipeppr cprequire */
cprequire_test(["inline:com-chilipeppr-workspace-nodemcu"], function(termWs) {

    console.log("initting workspace");
    termWs.init();
    $('title').html("Console Workspace");

} /*end_test*/ );

// This is the main definition of your widget. Give it a unique name.
cpdefine("inline:com-chilipeppr-workspace-nodemcu", ["chilipeppr_ready"], function() {
    return {
        /**
         * The ID of the widget. You must define this and make it unique.
         */
        id: "com-chilipeppr-workspace-nodemcu", // Make the id the same as the cpdefine id
        name: "Workspace / NodeMCU", // The descriptive name of your widget.
        desc: `A ChiliPeppr Workspace that lets you interact with the NodeMCU device. \
The NodeMCU device is an ESP8266 wifi module with an attached USB serial port bridge \
so you can easily use it and program it from your computer via the serial port. Thus, the NodeMCU \
works brilliantly with ChiliPeppr. Secondly, \
the NodeMCU has the Lua language preloaded onto the ESP8266 so you can easily program \
the device.This workspace gives you convenience methods for programming the NodeMCU device. \
You can buy the ESP8266 on ebay.com or aliexpress.com.`,
        url: "(auto fill by runme.js)", // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)", // The standalone working widget so can view it working by itself
        /**
         * Contains reference to the Console widget object.
         */
        widgetConsole: null,
        /**
         * Contains reference to the Serial Port JSON Server object.
         */
        widgetSpjs: null,
        /**
         * The workspace's init method. It loads the Console widget and then the SPJS widget.
         */
        init: function() {

            var that = this;

            $('#' + this.id).removeClass("hidden");

            // Load the console widget
            this.loadConsoleWidget(function() {

                console.log("console widget loaded, now lets load spjs");
                
                // now we can load the SPJS widget
                that.loadSpjsWidget(function() {

                    // if we get here, we can init the Console Widget
                    that.widgetConsole.init(true);
                    //that.widgetConsole.resize();

                    that.setupResize();
                })

            })

        },
        /**
         * Returns the billboard HTML, CSS, and Javascript for this Workspace. The billboard
         * is used by the home page, the workspace picker, and the fork pulldown to show a
         * consistent name/image/description tag for the workspace throughout the ChiliPeppr ecosystem.
         */
        billboard: function() {
            var el = $('#' + this.id + '-billboard');
            el.removeClass("hidden");
            return el;
        },
        /**
         * Listen to window resize event.
         */
        setupResize: function() {
            $(window).on('resize', this.onResize.bind(this));
        },
        /**
         * When browser window resizes, forcibly resize the Console window
         */
        onResize: function() {
            this.widgetConsole.resize();
        },
        /**
         * Load the Console widget via chilipeppr.load()
         */
        loadConsoleWidget: function(callback) {
            var that = this;
            chilipeppr.load(
                "#consoleWidget",
                "http://fiddle.jshell.net/chilipeppr/rczajbx0/show/light/",
                function() {
                    // Callback after widget loaded into #myDivWidgetInsertedInto
                    cprequire(
                        ["inline:com-chilipeppr-widget-spconsole"], // the id you gave your widget
                        function(mywidget) {
                            // Callback that is passed reference to your newly loaded widget
                            console.log("My widget just got loaded.", mywidget);

                            that.widgetConsole = mywidget;

                            // load spjs widget so we can test
                            //http://fiddle.jshell.net/chilipeppr/vetj5fvx/show/light/
                            callback();


                        }
                    );
                }
            );
        },
        /**
         * Load the Serial Port JSON Server widget via chilipeppr.load()
         */
        loadSpjsWidget: function(callback) {

            var that = this;

            chilipeppr.load(
                "#spjsWidget",
                "http://fiddle.jshell.net/chilipeppr/vetj5fvx/show/light/",
                function() {
                    console.log("mycallback got called after loading spjs module");
                    cprequire(["inline:com-chilipeppr-widget-serialport"], function(spjs) {
                        //console.log("inside require of " + fm.id);
                        spjs.setSingleSelectMode();
                        spjs.init();
                        //spjs.showBody();
                        //spjs.consoleToggle();

                        that.widgetSpjs = spjs;

                        callback();

                    });
                }
            );
        }
    };
});