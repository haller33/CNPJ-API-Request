'use stricts'


const fs = require('fs')
const os = require('os')


let FLAGSILENT = false


const Curry = fun => app => arg => app ( fun ( arg ) )

const not = something => !something

const truthness = something => not ( not ( something ) )

const and = frist => secon => frist && secon

const or = frist => secon => frist || secon


const print = something => {

    if ( not ( FLAGSILENT ) )
	console.log ( something )
}

const fileExist = filepathname => {

    return fs.existsSync ( filepathname )
}


const stringFile = filepathname => {

    let path = filepathname.replace( /^/, './' )
    
    let result = fs.readFileSync ( path ).toString (  )

    return result
}


const gencsvArry = arrLinesCSV  => {

    let fileArr = [ ]

    const DELIMITER = ','

    arrLinesCSV.forEach ( item => {
	fileArr.push ( item.split ( DELIMITER ) )
    } )
    
    return fileArr
}

const saveFileString = async ( filenamepath, stringFile ) => {

    return new Promise ( ( rest, errt ) => {

	fs.writeFile ( filenamepath, stringFile, 'utf8', err => {
	    if ( err ) 
		errt ( err )

	    rest ( true )
	} )
    } )
}

const genLinesFromStringCSV = string => {

    const ELEMETREMOVER = '\r'
    
    const newLines = string.split ( '\n' )
	  .map ( r => r.replace ( ELEMETREMOVER, '' ) )
    
    return newLines
}

const genStringCSVFromStringLines = arry => {

    let ArrToString = ''

    const DELIMITER = ';\n'

    arry.forEach( lines => ArrToString += lines + DELIMITER )

    return ArrToString
}

const gencsvArryLines = arrMatCSV => {

    let arrCSV = [  ]

    arrMatCSV.forEach ( line => arrCSV.push ( line.join( ',' ) ) )
    
    return arrCSV
}

const genCSVFile = arrCSV => fileResultName => {

    csvArray = gencsvArryLines ( arrCSV )

    stringsg = genStringCSVFromStringLines ( csvArray )
    
    const formatFile = 'csv'
    
    const fileto = fileResultName + '.' + formatFile

    saveFileString ( fileto , stringsg )
	.then ( res => {

	    print ( "Save! CSV" )
	    print ( "File: " + fileto )
	} )
	.catch ( err => print ( err ) ) 
}

const formatCSV = coluns => arrCSV => {

    newCSVarr = []

    const genLine = possitions => lineToRead => {

	let line = [  ]
	
	possitions.forEach ( pos => {
	    
	    line.push ( lineToRead [ pos ] )
	} )
	
	return line
    } 

    const genLineTo = genLine ( coluns )

    arrCSV.forEach ( line => {

	newCSVarr.push ( genLineTo ( line ) )
    } )
    
    return newCSVarr
}

const formatMyCSVFile = filename => coluns => {

    if ( fileExist ( filename ) ) {

	fileString = stringFile ( filename )

	const MyFormatCSV = formatCSV ( coluns )

	const result = MyFormatCSV ( gencsvArry ( genLinesFromStringCSV
						  ( fileString ) ) )

	return result
    }
}

( async main => {

    let argumetsMain = []

    process.argv.forEach ( ( item, inx ) => {

	if ( inx >= 2 )
	    argumetsMain.push ( item )
    } )

    let resultFile = argumetsMain [ 0 ] 

    let filename = argumetsMain [ 1 ]

    let coluns = []

    argumetsMain.forEach ( ( item, ind ) => {

	if ( ind > 1 ) {

	    coluns.push ( item )
	}
    } )

    const MyForm = formatMyCSVFile ( filename )
    
    genCSVFile ( MyForm ( coluns ) )( resultFile )
    
    return 0

} )(  )













