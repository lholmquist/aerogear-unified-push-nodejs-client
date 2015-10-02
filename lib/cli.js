var nopt = require( "nopt" ),
    agSender = require( "../lib/unifiedpush-node-sender" ),
    knownOpts = {
        "url": [ String, null ],
        "app-id": [ String, null ],
        "master-secret": [ String, null ],
        "message": [ String, null ],
        // "simple-push": [ String, Boolean ],
        "version": [ Boolean, null ], // Not the simplePush Version
        "debug": Boolean
    },
    shortHands = {
        "u": [ "--url" ],
        "a": [ "--app", "--app-id" ],
        "s": [ "--secret", "--master-secret"],
        "m": [ "--message" ],
        // "sp": [ "--simple-push" ],
        "v": [ "--version" ], // Not the simplePush Version
        "d": [ "--debug" ]
    };

function parse(args) {
    var message, settings,
        parsed = nopt( knownOpts, shortHands, args, 2 );

        if( parsed.version ) {
            console.log( require( "../package.json" ).version );
            process.exit( 0 );
        }

        if( !parsed.url ) {
            console.error( "No URL" );
            if( parsed.debug ) {
                console.error( "The URL must be valid and in the format http://host:port/context" );
            }
            process.exit( 1 );
        }

        //Send a Message
        message = {
            alert: parsed.message,
            sound: "default",
            badge: 1
        };

        settings = {
            url: parsed.url,
            applicationID: parsed.app,
            masterSecret: parsed.secret
        };

        // if( parsed[ "simple-push" ] ) {
        //     // Add Simple Push
        //     settings[ "simple-push" ] = "version=" + ( parsed[ "simple-push" ] === "true" ? new Date().getTime() : parsed[ "simple-push" ] );
        // }

        if( parsed.debug ) {
            console.log( "URL", parsed.url );
            console.log( "message", message );
            console.log( "settings:", settings );
        }

        agSender.Sender( settings )
            .send( message, {} )
            .on( "success", function( response ) {
                console.log( "Message Sent" );
                if( parsed.debug ) {
                    console.log( "Response: ", response );
                }
            })
            .on( "error", function( err ) {
                console.error( "There was an error sending the message" );
                if( parsed.debug ) {
                    console.error( "Error: ", err );
                }
            });
}

module.exports = {
    argv: function (args) {
        parse(args);
    }
};

