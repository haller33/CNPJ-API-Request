'use stricts'

/**
 * Includes For Library
 * Include Request to API Interface, FS to Filesystem Manipulation and 
 * json2xls to convert json's to XLSX
 */

const fs = require('fs')
const request = require('request');
const json2xls = require('json2xls');
const os = require('os')

const CNPJREQUERTURL = 'http://receitaws.com.br/v1/cnpj/'

const TIMESLEEPDEFAULT = 48

const CONSTCNPJEMPTY = '00000000000000'

const MICRSECONDSTIMEFORMULTIPLICATION = 1000

let FLAGSILENT = false

const Curry = fun => app => arg => app ( fun ( arg ) )

const not = something => !something

const truthness = something => not ( not ( something ) )

const and = frist => secon => frist && secon

const or = frist => secon => frist || secon

const flagStop = something => {

    FLAGSILENT = true

    return FLAGSILENT

    exit (  )
}

const schemaGetSul = something => {

    if ( typeof ( something ) == 'object' ) {

	if ( typeof ( something.data.msg ) == 'string' ) {
	    
	    something.data = {

		atividade_principal: [
		    {
			code: "00.00-0-00",
			text: 'nao existe'
		    }
		],
		atividades_secundarias: [
		    {
			code: "00.00-0-00",
			text: 'nao existe'
		    }
		],
		cnpj: CONSTCNPJEMPTY,
		novoCnpj: CONSTCNPJEMPTY
	    }
	}
    }

    return something.data
}

const schemaData = ( outData, historyData ) => {

    return { out: outData, history: historyData }
}

const schemaDataRead = ( idSource, dataSource ) => {

    return { id: idSource, data: dataSource }
}

const schemaStandatData = ( flag, dataTo = {  } ) => {

    return { resut: flag, data: dataTo }
}

const schemaGetResultStandat = ( data = {  } ) => {

    return data.resut
}

const schemaSendData = ( flag, dataInter ) => {

    return schemaStandatData ( flag, dataInter )
}

const schemaSendCNPJ = ( flag, dataInter, newCnpj ) => {

    if ( typeof ( dataInter ) == 'object' )
	dataInter [ 'novoCnpj' ] = newCnpj 
    
    return schemaSendData ( flag, dataInter )
}

const schemaEmpty = mensage => ( flag, dataInter, cnpj ) => {

    if ( isObjectEmpty ( dataInter ) )
	dataInter [ 'msg' ] = mensage

    return schemaSendCNPJ ( flag, dataInter, cnpj )
}

const schemaSearchData = ( flag, dataInter ) => {

    return schemaSendData ( flag, dataInter )
}

const schemaDataUserShow = objst => {

    if ( typeof ( objst ) == 'object' ) {

	let obj = {  }

	if ( not ( typeof ( objst [ 'id' ] ) == 'object' ) )
	    obj [ 'Codigo Empresa' ] = objst.id
	
	if ( not ( typeof ( objst [ 'code' ] ) == 'object' ) )
	    obj [ 'code' ] = objst.code [ 0 ].code

	if ( not ( typeof ( objst.code [ 0 ][ 'text' ] ) == 'object' ) )
	    obj [ 'Atividade Principal' ] = objst.code [ 0 ].text

	if ( not ( typeof ( objst.code [ 'cnpj' ] ) == 'object' ) )
	    obj [ 'CNPJ' ] = objst.cnpj

	if ( not ( typeof ( objst [ 'indice' ] ) == 'object' ) )
	    obj [ 'linha' ] = objst [ 'indice' ]

	return obj
	    
    } else throw new Error ( "Objeto não é String" )
}

const shemaDataQuest = ( idData, atPrincipal, atSecundaria, cnpjReal, cnpj ) => {

    return {
	id: idData,
	code: atPrincipal,
	atividadesSec: atSecundaria,
	cnpjReal: cnpjReal,
	cnpj: cnpj
    }
}

const print = something => {

    if ( not ( FLAGSILENT ) )
	console.log ( something )
}

const formataResultado = obb => {

    print ( obb )
}

const completeZeros = ( cnpj, lim = 14 ) => {

    if ( cnpj.length >= lim )
	return String ( cnpj )
    
    return String ( completeZeros ( '0' + String ( cnpj ) ) )
}

const checkEmptyCNPJ = someCNPJ => {

    return someCNPJ !== ''
}

const isUnknowCNPJ = someCNPJ => {

    return someCNPJ == CONSTCNPJEMPTY
}

const isChanNumber = variableString => {

    let boolCaracter = true

    const regexOfLether = /[0-9]/
    
    if ( typeof ( variableString ) == 'string' ) {

	variableString.split ( '' ).forEach ( item => {

	    boolCaracter = ( regexOfLether.test ( item ) && boolCaracter )
	} )
    }

    return boolCaracter
}

const fileExist = filepathname => {

    return fs.existsSync ( filepathname )
}

const stringFile = filepathname => {

    let path = filepathname.replace( /^/, './' )
    
    let result = fs.readFileSync ( path ).toString (  )

    return result
}

const openJSON = filepathname => {

    result = ''
    
    if ( not ( fileExist ( filepathname ) ) )
	result = '{}'
    else
	result = stringFile ( filepathname )

    actualData = JSON.parse ( result )

    return actualData
}

const saveFileString = async ( filenamepath, stringFile ) => {

    return new Promise ( ( rest, errt ) => {

	fs.writeFile(filenamepath, stringFile, 'utf8', err => {
	    if ( err ) 
		errt ( err )

	    rest ( schemaStandatData ( true, { } ) )
	} )
    } )
}

const saveFileJSON = async ( filenamepath, dataTo = dataflow.getData (  ) ) => {

    let json = JSON.stringify ( dataTo )

    return new Promise ( ( rest, errt ) => {
	saveFileString ( filenamepath, json )
	    .then ( res => {
		
		rest ( schemaStandatData ( true, res ) )
	    } ).catch ( err => {
		
		errt (  schemaStandatData ( false, err ) )
	    } )
    } )
}

const saveConfig = path => data => {

    let jsonString = JSON.stringify ( data )

    return new Promise ( ( rest, errt ) => {
	saveFileString ( path, jsonString )
    	    .then ( res => {

		rest ( true )
	    } ).catch ( err => {
		errt ( false )
	    } )
    } )
}

const saveConfigFile = async ( filepath = configurations.config (  ).configFile ) => {

    return saveConfig ( filepath )( configurations.config (  ) )
}

const waitForServer = async (  ) => {

    await sleep ( Math.pow ( configurations.config (  )
			    .timeInSecondsWaitForSendRequest, 2 ) )
}

const loadFile = async filepathname => {

    if ( not ( fileExist ( filepathname ) ) ) {

	await createResultFileName ( filepathname )( dataflow.getData (  ) )
	dataflow.reset (  )
    } else {

	actualData = openJSON ( filepathname )

	print ( not ( isObjectSchemeData ( actualData ) ) )

	if ( not ( isObjectSchemeData ( actualData ) ) )
	    dataflow.reset (  )
	else
	    dataflow.load ( schemaData ( actualData.out, actualData.history ) )
    }
}

const createResultFileName = fileName => dataTo => {

    return saveFileJSON ( fileName, dataTo )
}

const readfileSource = filenameandpath => {
    
    arrty = []
    
    result = stringFile ( filenameandpath )

    trota = 0

    result
	.split ( '\n' )
        .forEach ( line => {

	    let aux = line.split ( ';' )
/*
	    print( aux[1] )
	    print ( aux )
*/
	    let id = aux [ 0 ]
	    let data = aux [ 1 ]

	    if ( typeof ( data ) == 'string' )
		data = data.slice( 0 , data.length - 1 )
	    
	    if ( isChanNumber ( id ) )
		arrty.push( schemaDataRead ( id, data ) )
	    else
		trota += 1
	} )

    if ( trota > 1 )
	throw "arquivo com palavras no lugar do ID Empresa"
    
    return arrty
}

const configurations = ( (  ) => {

    let optionsObj = { }

    const schemaDataConfiguration = (
	fileOutput,
	fileInput,
	fileSwap,
	configFile,
	formatFile,
	urlRequest,
	timeInSecondsWaitForSendRequest,
	timesMicroSeconds ) => {
	
	return {
	    fileOutput,
	    fileInput,
	    fileSwap,
	    configFile,
	    formatFile,
	    urlRequest,
	    timeInSecondsWaitForSendRequest,
	    timesMicroSeconds
	}
    }
    
    const loadConfigurations = file => {

	optionsObj = schemaDataConfiguration (
	    file.fileOutput,
	    file.fileInput,
	    file.fileSwap,
	    file.configFile,
	    file.formatFile,
	    file.urlRequest,
	    file.timeInSecondsWaitForSendRequest,
	    file.timesMicroSeconds
	)

	return schemaStandatData ( true, { } )
    }

    const getConfigBy = param => optionsObj [ param ]

    const objConfs = (  ) => optionsObj

    const inicialize = (
	fileOut = 'result',
	fileInput = 'source.csv',
	fileSwap = 'swap.json',
	fileConf = 'configCnpj.json',
	sdformatFile = 'xlsx',
	urlRequest = CNPJREQUERTURL,
	timeSleep = TIMESLEEPDEFAULT,
	microSeconds =  MICRSECONDSTIMEFORMULTIPLICATION ) => {
	    
	    optionsObj = schemaDataConfiguration (
		fileOut,
		fileInput,
		fileSwap,
		fileConf,
		sdformatFile,
		urlRequest,
		timeSleep,
		microSeconds
	    )
	}

    inicialize (  )
    
    return {

	loadConfigurations: loadConfigurations,
	reset: inicialize,
	getConfig: getConfigBy,
	config: objConfs
    }
    
} )(  )

const sleep = async ( timeSeconds = configurations.config (  )
		      .timeInSecondsWaitForSendRequest ) => {

    return new Promise ( ( res, err ) => {

	setTimeout ( res, timeSeconds * configurations.config (  )
		   .timesMicroSeconds )
    } ) }

const isObject = obj => {

    return typeof ( obj ) == 'object'
}

const isObjectEmpty = obj => {

    return isObject ( obj ) && Object.keys ( obj ).length == 0
}

const isObjectsArrayEmpty = objb => {

    return isObjectEmpty ( objb ) && objb.length == 0
}

const isObjectSchemeData = objbj => {

    return ( not ( isObjectEmpty ( objbj ) ) && objbj.history.length >= 0 )
}

const dataflow = ( (  ) => {

    let data = {}

    let FLAGEMPTY = false
    
    const add = newdt => {

	if ( truthness ( data.out.cnpj ) ) {

	    let aux = data.out
	    
	    data.history.push ( aux )
	}

	data.out = newdt

	FLAGEMPTY = false
    }

    const getData = _ => {

	return data
    }

    const car = _ => {

	return data.out
    }

    const cdr = _ => {

	return data.history
    }
    
    const load = ( datanew, flag = false ) => {

	FLAGEMPTY = flag
	data = schemaData ( datanew.out, datanew.history )
    }

    const search = ( id, cnpj, flagDeep = false, dataTo = data ) => {

	if ( not ( FLAGEMPTY ) ) {
	    
	    let find = []
	
	    if ( ( completeZeros ( data.out.cnpj ) == completeZeros ( cnpj ) ) &&
		 ( dataTo.out.id == id ) ) {

		if ( flagDeep )
		    return schemaSearchData ( true, dataTo.out )
		
		find.push ( schemaSearchData ( true, dataTo.out ) )
	    } else {

		for ( let i = 0; i < dataTo.history.length; i++ ) {

		    if ( ( completeZeros ( dataTo.history[i].cnpj ) == completeZeros ( cnpj ) ) &&
			 ( dataTo.history[i].id == id ) ) {

			if ( flagDeep )
			    return schemaSearchData ( true, dataTo.history [ i ] )
			find.push ( schemaSearchData ( true, dataTo.history [ i ] ) )
		    }
		}
	    }
   
	    if ( find.length == 0 )
		return schemaSearchData ( false,  [ ] )
	    else
		return schemaSearchData ( true, find )
	} return schemaSearchData ( false,  [ ] ) 
    }

    const reset = _ => {

	FLAGEMPTY = true
	data = schemaData ( {}, [] )
    }

    const FLAGTRUE = _ => {

	FLAGEMPTY = false
    }

    reset (  )
//    FLAGTRUE (  )

    return {

	load,
	add,
	car,
	cdr,
	search,
	getData,
	reset
    }
} )(  )

const reqsite = cnpjt => {

    const ActualCNPJ = completeZeros ( cnpjt )
    
    const url = configurations.config (  ).urlRequest + ActualCNPJ

    return new Promise ( ( rest, errt ) => {

	if ( checkEmptyCNPJ ( ActualCNPJ ) ) {

	    if ( isUnknowCNPJ ( ActualCNPJ ) ) {

		rest ( schemaEmpty ( " CNPJ VAZIO " )( false , {}, ActualCNPJ ) )
	    }
	    
	    request.get ( url, ( err, res, body ) => {
		if ( err )
		    if ( res.statusCode !== 200 )
			errt ( err )

		result = JSON.parse ( body )

		rest ( schemaSendCNPJ ( true, result, ActualCNPJ ) )
		
	    } )
	} else {
	    
	    rest ( schemaSendData ( false, { } ) )
	}
    } )
}

const Resolution = async ( fileSource, ResultFileName ) => {
    
    let fileArry = readfileSource ( fileSource )

    await loadFile ( ResultFileName )

    for ( i = 0; i < fileArry.length; i++) {

	ncpj = ( fileArry [ i ] ).data
	idData = ( fileArry [ i ] ).id

	if ( not ( dataflow.search ( idData, ncpj ).resut ) ) {
   
	    reqsite ( ncpj )
		.then ( res => {

		    const nowt = schemaGetSul ( res )

		    dataflow.add (
			shemaDataQuest (
			    idData,
			    nowt.atividade_principal,
			    nowt.atividades_secundarias,
			    nowt.cnpj,
			    nowt.novoCnpj ) )

//		    saveFileJSON ( ResultFileName )

		    formataResultado ( dataflow.car (  ) )
		} ).catch ( async err => {

		    // print ( dataflow.getData (  ) )
		    // throw err // DEPRECATED
		    print ( "Esperando Resposta Do Servidor" )
		    print ( "..." )
		    waitForServer (  )
		} )
	    
	    await sleep ( configurations.config (  )
			  .timeInSecondsWaitForSendRequest )
	}
    }
}


const normalizeDataFlower = item => {

    if ( typeof ( item.code ) == 'undefined' ) {

	item.text = '********'
	item.code = '00.00-0-00'

	if ( typeof ( item.cnpj ) == 'undefined' ) {

	    let frasePadrao = '00000000000000' // 'NÃ£o Informado'

	    item.cnpj = frasePadrao
	    item.cnpjReal = frasePadrao
	}
    } else {

	item.text = item.code[0].text
	item.code = item.code[0].code
    }

    return item
}

const gencsvArry = _ => {

    dataFile = dataflow.car (  )
    dataCDR = dataflow.cdr (  )
    
    const genStringLinha = ( id, ramo, cnpj, code ) => {

	const separa = ';'

	const inicioLinha = ''
	
	const finalLinha = '\n'

	let stringa = inicioLinha + id + separa + ramo + separa + cnpj +
	    separa + code + finalLinha

	return stringa
    }
    
    let lineCabecalho = genStringLinha ( "ID", "RAMO", "CNPJ", "CODE" )

    let fileArr = []

    fileArr.push ( lineCabecalho )
    
    dataCDR.forEach ( item => {

	fileArr.push (
	    genStringLinha ( item.id ,item.text, item.cnpj, item.code )
	)
    } )
    
    fileArr.push ( genStringLinha ( dataFile ) )
    
    return fileArr
}

const genStringCSV = arry => {

    let ArrToString = ''

    arry.forEach( lines => ArrToString += lines )

    return ArrToString
}

const genCSVFile = async (  ) => {

    const filenameArquive = configurations.config (  ).fileOutput
    
    loadFile ( configurations.config (  ).fileSwap )

    csvArray = gencsvArry (  )

    stringsg = genStringCSV ( csvArray )

    // print (stringsg)

    saveFileString ( filenameArquive, stringsg ) 

    print ( "Save! CSV" )
}

const genXLSX = _ => {

    rows = []

    const cell = data => {

	return {
	    IDEMPRESA: data.id,
	    RAMO: data.text,
	    CODE: data.code,
	    CNPJ: data.cnpj
	}
    }

    const dotThe = (  ) => '.'
 
    flowa = dataflow.cdr (  )

    flowa.forEach ( line => {

	rows.push ( cell ( normalizeDataFlower ( line ) ) )
    } )

    const lastRow = normalizeDataFlower ( dataflow.car (  ) )

    rows.push ( cell ( lastRow ) )

    const xls = json2xls ( rows )

    const fileNamePath = configurations.config (  ).fileOutput + dotThe (  )
	  + configurations.config (  ).formatFile

    fs.writeFileSync(fileNamePath, xls, 'binary')

    print ( "Save! XLSX" )
}

const constuctorMatchParm = (  ) => {

    let Opt = {}

    const schemaResult = flag => ( itemTo, arg ) => {

	return {

	    status: flag,
	    item: itemTo,
	    arg: arg
	}
    }

    const listKeys = (  ) => Object.keys ( Opt )

    const addSomethNew = pri => optione => {

	if ( typeof ( Opt [ pri ] ) == 'undefined' )
	    Opt [ pri ] = [ optione ]
	else
	    ( Opt [ pri ] ).push ( optione )
    }
    
    const addOpt = pri => opt => {

	addSomethNew ( pri )( opt )
    }
    
    const matchTo = funTestTo => ( listToMatch ) => {

	let runit = [ ]

	listKeys (  ).forEach ( group => {

	    Opt [ group ].forEach ( item => {

		listToMatch.forEach ( elm => {

		    let label = elm [ 0 ]
			
		    if ( funTestTo ( item ) == label ) {

			let argt = elm [ 1 ]

			schematcksToDo = schemaResult ( true )
			
			runit.push ( schematcksToDo ( item, argt ) )
		    }
		} )
	    } )
	} )

	return runit
    }

    const reset = (  ) => {

	Opt = {}
    }

    return {

	match: matchTo,
	add: addOpt,
	reset: reset
    }
}

const menuComand = args => {

    const schemaCall  = ( string, func ) => {

	return { group: string, fun: func }
    }

    const schemaStatusGet = something => {

	return something.status
    }

    const schemaToGetFromResult = something => {

	return something.item
    }

    const shemaGetArgs = something => {

	return something.arg
    }
    
    const schemaTestGetCallGrp = something  => {

	return something.group
    }

    const errorInMatchArg = args => mathes => {

	return ( ( mathes > 0 ) && ( args == mathes ) )
    }

    const existObjt = something => typeof ( something ) != 'undefined'

    const helpMenu = optMenu => {

	let stringAA = ''

	if ( ( existObjt ( optMenu ) ) &&
	     ( optMenu.error ) )
	    stringAA += 'Opcao Invalida\n'
	
	stringAA += 'Digite algumas das Seguintes Opcoes'

	stringAA += '\n   --help|-h\t: mostra o menu Atual'
	stringAA += '\n   --silent|-S\t: desabilita modo verboso'
	stringAA += '\n   --test|-t\t: testa funcionalidades'
	stringAA += '\n   --check|-ck\t: checa integridade do database'
	stringAA += '\n   --config|-c\t: configura aplicacao,'
	stringAA += '\n                  parametros separados por virgula.'
	stringAA += '\n   --request|-r\t: faz requisicoes a API'
	stringAA += '\n   --export|-e\t: gera arquivo csv/xls'
	stringAA += '\n                  '
	
	print ( stringAA )

	flagStop (  )
    }

    const checkIntegrit = async opt => {

	await loadFile ( configurations.config (  ).fileSwap )

	const schemaDataIntegrid = ( id, something ) => {

	    if ( typeof ( something ) == 'object' )
		something [ 'indice' ] = id
	    
	    return schemaDataUserShow ( something )
	}

	let conta = 0
	
	let db = dataflow.getData (  )

	db.history.push ( db.out )

	let problem = false

	let encontrado = [  ]

	print ( "Listagem de Linhas Repetidas, em Arquivo de Parse : " )

	for ( let j = 0; j < db.history.length; j++ ) {

	    for ( let i = 0; i < db.history.length; i++ ) {

		conta = 1

		if ( i != j ) {

		    if ( ( db.history[ j ].id == db.history[ i ].id ) &&
			 ( db.history[ j ].cnpj == db.history[ i ].cnpj ) ) {

			conta += 1
			
			problem = problem || true 
		    }
		    
		    if ( conta > 1 ) {
			
			encontra = schemaDataIntegrid ( i, db.history [ i ] )
			
			formataResultado ( schemaDataIntegrid ( i, db.history[ i ] ) )
		    }
		}
	    }
	}

	if ( not ( problem ) )
	    print ( "Tudo esta Ok!" )
	else
	    print ( "Alguns Problemas foram Encontrados" ) 
    }

    const configureMenu = optiones => {

	const configInside = constuctorMatchParm (  )

	const schemaLoadReturn = flg => dataResult => {

	    return { flag: flg, data: dataResult }
	}

	const schemaTestTo = something => something [ 0 ]

	const helpConfig = async ( optMenu = {  } ) => {

	    let stringAA = ''

	    if ( optMenu['status'] == false )
		stringAA += 'Opcao Invalida'
	    
	    stringAA += '\nDigite algumas das Seguintes Opcoes para --config\n'

	    stringAA += '\n   Sintaxe --config={opcao}@{valor}[,]?\n'
	    stringAA += '\n   help\t\t: mostra o menu Atual'
	    stringAA += '\n   time\t\t: seta tempo de espera em cada '
	    stringAA += '\n                  requisicao'
	    stringAA += '\n   fileSwap\t: seta arquivo de parse'
	    stringAA += '\n   fileSource\t: seta arquivo de fonte de dados'
	    stringAA += '\n   urlRequest\t: seta url da API'
	    stringAA += '\n   formatFile\t: seta formato do arquivo em csv/xls',
	    stringAA += '\n   saveFileConf\t: seta e salva novo arquivo '
	    stringAA += '\n\t\t  de configuracao'
	    stringAA += '\n   configFile\t: seleciona arquivo de '
	    stringAA += '\n\t\t  configuracao '
	    stringAA += '\n   showConfig\t: mostra arquivo de configuracao'
	    stringAA += '\n\t\t  utilizado '
	    stringAA += '\n                  '

	    print ( stringAA )

	    flagStop (  )
	}

	const configMenuSave = async ( savename = configurations.config ( ).configFile ) => {

	    const newConf = configurations.config ( )

	    newConf.configFile = savename

	    configurations.loadConfigurations ( newConf )

	    await saveConfigFile ( savename )
	}

	const configGeneralTool = ( savest = false, flgCast = false, flgFormat = false, flgStopa = false ) => optiona => async valuest => {
 
	    const newConf = configurations.config ( )

	    const optionExist = ( font = {} ) => opt => {

		if ( typeof ( font [ opt ] ) == 'undefined' )
		    return false

		return true
	    }

	    const updateConfig = ( savename = configurations.config ( )
				   .configFile ) =>
		  async configTooNew => {

		configurations.loadConfigurations ( configTooNew )

		if ( savest )
		    await saveConfigFile ( savename )
	    }

	    if ( optionExist ( newConf )( optiona ) ) {

		if ( flgFormat )
		    valuest = ( valuest == 'csv' ) ? 'csv' : 'xlsx'
		    
		if ( flgCast )
		    valuest = parseInt ( valuest )
		
		newConf [ optiona ] = valuest
	    }

	    let save = configurations.config ( ).configFile

	    if ( savest ) {

		await configGeneralTool (  )( 'configFile' )( valuest )
		
		save = valuest
	    }
	    
	    await updateConfig ( save )( newConf )

	    if ( flgStopa )
		flagStop (  )
		
	}

	const configFileTool = ( savename = configurations.config ( ).configFile ) => {

	    const newConf = configurations.config ( )

	    newConf.configFile = savename

	    configurations.loadConfigurations ( newConf )

	    print ( configurations.config (  ) )
	}

	const getResultStatus = schemaGetResultStandat

	const showConfig = something => {

	    if ( something )
		helpConfig ( { status: false } )
	    
	    print ( configurations.config (  ) )
	}

	const showName = something => {

	    print ( something )
	    if ( something )
		helpConfig ( { status: false } )

	    print ( configurations.config (  ) )
	}
	
	const some = async (  ) => {  }

	( async mainConfigMenu => {

	    if ( truthness ( optiones ) ) {

		configInside.add ( 1 )( schemaCall ( 'help', helpConfig ) )
		configInside.add ( 2 )
		     ( schemaCall ( 'fileResult',
			       configGeneralTool (  )( 'fileOutput' ) ) )
		configInside.add ( 3 )
		     ( schemaCall ( 'configFile',
			       configGeneralTool (  )( 'configFile' ) ) )
		configInside.add ( 4 )
		     ( schemaCall ( 'formatFile',
			       configGeneralTool ( false, false, true )( 'formatFile' ) ) )
		configInside.add ( 4 )
		     ( schemaCall ( 'fileSwap',
			       configGeneralTool (  )( 'fileSwap' ) ) )
		configInside.add ( 4 )
		     ( schemaCall ( 'urlRequest',
			       configGeneralTool (  )( 'urlRequest' ) ) )
		configInside.add ( 4 )
		     ( schemaCall ( 'fileSource',
			       configGeneralTool (  )( 'fileInput' ) ) )
		configInside.add ( 4 )
		     ( schemaCall ( 'showConfig', showConfig ) )
		configInside.add ( 4 )
		     ( schemaCall ( 'showFileName', showName ) )
		configInside.add ( 5 )
		     ( schemaCall ( 'time',
			       configGeneralTool ( false, true )( 'timeInSecondsWaitForSendRequest' ) ) )
		configInside.add ( 7 )
		     ( schemaCall ( 'saveFileConf',
			       configGeneralTool ( true )(  ) ) )

		const otMatch = configInside.match ( schemaTestGetCallGrp  )

		const res = otMatch ( optiones )

		const mathReslts = errorInMatchArg ( optiones.length )

		const NotexistErros =  mathReslts ( res.length )

		if ( NotexistErros ) { 

		    res.forEach ( item => {

			if  ( schemaStatusGet ( item ) )
			    ( schemaToGetFromResult ( item ) )
			    .fun ( shemaGetArgs ( item ) )
		    } )
		} else helpConfig ( { status: false } )
	    } else helpConfig ( { status: false } )
	} )(  )
    }

    const silence = ( value = true ) => {

	if ( typeof ( value ) == 'object' )
	    value = value [ 0 ] == 'true'
	else 
	    if ( not ( existObjt ( value ) ) )
		value = true
	
	FLAGSILENT = value
    }
    
    const requisit = async option => {

	print ( "Requisicoes de CNPJ" )

	Resolution ( configurations.config (  ).fileInput,
		     configurations.config (  ).fileSwap )
    }

    const exportTest = opt => {

	const formatFileOut = optn => {

	    if ( not ( typeof ( optn ) == 'undefined' ) ) {
		
		genCSVFile (  )
		genXLSX (  )
	    }
	}

	const HelpMenuExport = optMenu => {

	    let stringAA = ''
/*
	    if ( optMenu['status'] == false )
		stringAA += 'Opcao Invalida'
*/
	    
	    stringAA += '\nDigite algumas das Seguintes Opcoes para --export\n'

	    stringAA += '\n   Sintaxe --export={opcao}@{valor}[,]?\n'
	    stringAA += '\n   help\t\t: mostra o menu Atual'
	    stringAA += '\n   format\t: seta formato csv/xls'
	    stringAA += '\n                  '

	    print ( stringAA )
	    
	    flagStop (  )
	}

	( async mainConfigMenu => {

	    if ( truthness ( opt ) ) {

		const configInside = constuctorMatchParm (  )

		configInside.add ( 1 )
		( schemaCall ( 'help', HelpMenuExport ) )
		configInside.add ( 2 )
		( schemaCall ( 'format', formatFileOut) )

		const otMatch = configInside.match ( schemaTestGetCallGrp  )

		const res = otMatch ( opt )

		const mathReslts = errorInMatchArg ( opt.length )

		const NotexistErros =  mathReslts ( res.length )

		if ( NotexistErros ) { 

		    res.forEach ( item => { 

			if  ( schemaStatusGet ( item ) )
			    ( schemaToGetFromResult ( item ) )
			    .fun ( shemaGetArgs ( item ) )
		    } )
		} else helpConfig ( { status: false } )
	    } else helpConfig ( { status: false } )
	} )(  )

    }

    let optioness = constuctorMatchParm (  )
    
    optioness.add( 1 )( schemaCall ( '--silent', silence ) ) // Flags
    optioness.add( 1 )( schemaCall ( '-S', silence ) )
    optioness.add( 2 )( schemaCall ( '--test', exportTest ) ) // Test
    optioness.add( 2 )( schemaCall ( '-t', exportTest ) ) 
    optioness.add( 2 )( schemaCall ( '--help', helpMenu ) ) // Control
    optioness.add( 2 )( schemaCall ( '-h', helpMenu ) )
    optioness.add( 2 )( schemaCall ( '--config', configureMenu ) )
    optioness.add( 2 )( schemaCall ( '-c', configureMenu ) )
    optioness.add( 2 )( schemaCall ( '--check', checkIntegrit ) )
    optioness.add( 2 )( schemaCall ( '-ck', checkIntegrit ) )
    optioness.add( 3 )( schemaCall ( '--request', requisit ) )
    optioness.add( 3 )( schemaCall ( '-r', requisit ) )
    optioness.add( 3 )( schemaCall ( '--export', exportTest ) )
    optioness.add( 3 )( schemaCall ( '-e', exportTest ) )
    

    const funtSlt = simbol => someString => someString.split ( simbol )

    const checks = e => {

	print ( "TT" )
	print ( e )
	return e
    }

    const MyApply = func => tester => something => {

	if ( tester ( something ) )
	    return func ( something )
	else
	    return something  
    }

    const isRealyAList = I => {

	return typeof ( I.length ) == 'number'
    }
    
    const isList = ( argFunTes = isRealyAList ) => someLis => {

	if ( typeof ( someLis ) == 'object' )
	    if ( argFunTes ( someLis ) )
		return true
	return false
    }
    
    const checkEmptyList = arrLis => {

	if ( isList ( I => I.length == 1 )( arrLis ) )
	    return arrLis [ 0 ]
	
	return arrLis
    }

    const MyMap = ( fun = e => e ) => arr =>
	  arr.map ( it => {

	      return fun ( it )
	  } )

    const splitEqual = funtSlt ( '=' )

    const splitVirg = funtSlt ( ',' )

    const splitArroba = funtSlt ( '@' )


    const MysplitEqual = Curry ( splitEqual )( checkEmptyList )
    
    const MysplitArroba = splitArroba
    
    const MysplitVirg = splitVirg
    

    const mapSplitVirg = MyMap ( MysplitVirg )

    const mapSplitEqual = MyMap ( splitEqual )

    const mapSplitArroba = MyMap ( MysplitArroba )


    const customArroba = MyMap ( MyApply ( mapSplitArroba )( isList (  ) ) )
    

    const mapArrInside = MyMap ( mapSplitVirg )

    const mapArrArroba = MyMap ( customArroba )

    
    const CustonSplit = Curry ( mapArrInside )( mapArrArroba )
    
    const compositionMapSplit = Curry ( MyApply ( mapSplitEqual )( isList (  ) ) )( CustonSplit )


    const checkResultPathem = someArr => {

	if ( someArr.length == 0 )
	    return [ [ ] ]
	else
	    return someArr
    }
    
    const cells = compositionMapSplit ( args )

    const nonoCells = checkResultPathem ( cells )

    const filtherAnd = arr => functt => arr.reduce ( ( val, now ) => {
	// filther data

	if ( val.reduce ( functt ( now ), true ) )
	    val.push ( now )
	
	return val
    }, [ arr [ 0 ] ] )

    const notEqualValues = pri => secm => not ( pri == secm )
    
    const newCells = filtherAnd ( nonoCells )( now => ( accValues, nowt ) => {
	return accValues && notEqualValues ( now [ 0 ] )( nowt [ 0 ] ) }, true )

    // test Error in Insert Of User
    const testMatches = errorInMatchArg ( nonoCells.length )

    const ofMatch = optioness.match( schemaTestGetCallGrp )

    const run = ofMatch ( newCells )

    const NotExistErrors = testMatches ( run.length )

    if ( NotExistErrors ) {

	run.forEach ( it => {

	    if  ( schemaStatusGet ( it ) )
		( schemaToGetFromResult ( it ) ).fun ( shemaGetArgs ( it ) )
	} )
    } else helpMenu ( { error: true } )
}

const oldsMain = _ => {

    const filenameArquive = 'testjsonOld.xlsx'
    
    loadFile ('jsonOld.json.bkp')

/*    csvArray = gencsvArry (  )

    stringsg = genStringCSV ( csvArray )

//    print ( stringsg )

    saveFileString ( filenameArquive, stringsg ) 

    print ( "Save!" )
*/

    Resolution (  )
    ///tests (  )
    
    genXLSX (  )


}

const loadConfigurationsDefault = ( filepath = configurations.config (  ).configFile ) => {

    const flagExists = fileExist ( filepath )

    if ( flagExists ) {

	const configFileJSON = openJSON ( filepath )
	
	configurations.loadConfigurations ( configFileJSON )

    } else {

	configurations.reset (  )
    }

    return saveConfigFile (  )
}

( async main => {

    argumetsMain = []

    process.argv.forEach ( ( item, inx ) => {

	if ( inx >= 2 )
	    argumetsMain.push ( item )
    } )

    await loadConfigurationsDefault (  )
    
    menuComand ( argumetsMain )
    
} )(  )




