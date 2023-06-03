<?php

require_once 'Database.php';
function getWineries($controller)
{
	$input_json = $controller->get_post_json();
	$controller->assert_params(['return']);

	if(isset($input_json['search'])){ //Check if the search param is specified
		$search = $input_json['search']; //stores the array of inputted search fields
	}

	if (isset($input_json['fuzzy'])) {
		$fuzzy = $input_json['fuzzy'];
	} else {
		$fuzzy = true;
	}

	if (isset($input_json['limit'])) { //Check if limit param is specified
		$limit = $input_json['limit']; //store limit param
	}

	if(isset($input_json['sort']))	//check if sort was specified
	{
		$sort = $input_json['sort']; 
	}
	else
	{
		$sort = null;	//getReturnRecords handles a null sort parameter
	}

	if(isset($input_json['order']))	//check if order was specified
	{
		if($input_json['order'] == "DESC" || $input_json['order'] == "ASC")//validate order parameter
		{
			$order = $input_json['order'];
		}
	}
	else
	{
		$order = "DESC";	//default order value
	}
	
	$return_pars = $input_json['return'];

	getReturnRecords($controller,$return_pars, $sort, $order, $search, $limit, $fuzzy);
}
	//This function's purpose is to return all records with specified fields from the return array
	//This output is then sorted if required and ordered accordingly.
	//Returns a json object
function getReturnRecords($controller,$return_pars, $sort, $order, $search, $limit, $fuzzy)
{	
	$placeholders = implode(", ", $return_pars);
	$query = "SELECT " . $placeholders . " FROM wineries";
	$types = "";

	if (isset($search)) {
		$search_pars = array();
		$query .= ' WHERE ';
		foreach ($search as $key => $value) {
			if ($fuzzy === true) {
				$query .= $key . ' LIKE ? AND ';
				$value = '%' . $value . '%';
			} else {
				$query .= $key . ' LIKE ? AND ';
			}
			$types .= 's';
			array_push($search_pars, $value); //Add parameters for when stmnt is preapred
		}
		$query = substr($query, 0, strlen($query) - 4); //Remove the final extra AND clause
	}

	$sort_fields = array(
		"winery_id",
		"name",
		"description",
		"established",
		"location",
		"region",
		"country",
		"website",
		"manager_id"
	);
	
	if(isset($sort) && in_array($sort, $sort_fields))	//If sort is not null or doesn't exist it will load the sort conditions
	{
		$sort_params = $sort;
	}
	else
	{
		$sort_params = "name";//  default sort value
	}

	if(isset($sort))
	{
		$query = $query." ORDER BY ".$sort_params." ".$order;
	}
	if (isset($limit)) { // IF the limit param is specified
		if (is_numeric($limit)) {
			$query .= ' LIMIT ' . $limit; //Add limit clause to the query
		}
	}
	//Any code below this comment expectes the query to be have finished building
	$db = new Database();
	$result = $db->query($query,$types,$search_pars);

	if(!$result)
	{
		throw new Exception('Error: Wineries SQL Error',400);
	}

	$data = array();
	
	while($row = $result->fetch_assoc())
	{
		$data[] = $row;
	}
	$controller->success($data);
}
function addWineries($conn, $json){
	/*As an example, We expect
	{
		"type":"addWineries",
		"apikey":"a9198b68355f78830054c31a39916b7f",
		"wineries":[
			{
				"name": "",
				"description": "",
				"established": "",
				"location": "",
				"region": "",
				"country": "",
				"website": "",
				"manger_id": ""
			},
			{
				"name": "",
				"description": "",
				"established": "",
				"location": "",
				"region": "",
				"country": "",
				"website": "",
				"manger_id": ""
			}
			]
		}
		*/
	$input_json = json_decode($json);
	$wineries = array();// a variable to store all the wineries to be added
	$wineries = $input_json['wineries'];
	$params = array('name','description','established','location','region','country','website','manger_id');
	foreach ($wineries as $oneWinery) {
		if (count($oneWinery) !== 8) {
			header("HTTP/1.1 400 Bad Request");
			echo json_encode(array('status' => 'error','data' => 'Too many or too few params'));
			exit();
		}
		foreach ($params as $oneParam) {
			if (!array_key_exists($oneParam, $oneWinery)) {
				header("HTTP/1.1 400 Bad Request");
				echo json_encode(array('status' => 'error','data' => ('Missing data for ' . $oneParam)));
				exit();
			}
		}
	}
	addWineriesSQLCall($conn, $wineries);
}
function addWineriesSQLCall($conn, $wineries){
	$query = "INSERT INTO wineries (name, description, established, location, region, country, website, manger_id) VALUES";
	$allParams = array();
	$params = array('name','description','established','location','region','country','website','manger_id');
	$types = "";
	foreach ($wineries as $oneWinery) {
		$query .= '(?, ?, ?, ?, ?, ?, ?, ?), ';
		foreach ($params as $oneParam) {
			array_push($allParams, $oneWinery[$oneParam]);
			if ($oneParam == 'manager_id') {
				$types .= 'i';
			} else {
				$types .= 's';
			}
		}
	}
	$query = substr($query, 0, strlen($query) - 2);
	$query .= ' ';//changed semi-colon to space
	$stmt = $conn->prepare($query); //prepare the statements
	$stmt->bind_param($types, ...$allParams);
	try {
		$stmt->execute();
	} catch (\Throwable $th) {
		header("HTTP/1.1 400 Bad Request");
		echo json_encode(array('status' => 'error','data' => ('SQL error with statement' . $stmt->debugDumpParams())));
	}
	header("HTTP/1.1 200 OK");
	die();
}

function updateWinery($conn, $winery)
{
	$query = "UPDATE wineries SET ";
	$to_update = $winery['update'];
	// $update_fields = array(
	// 	"winery_id",
	// 	"name",
	// 	"description",
	// 	"established",
	// 	"location",
	// 	"region",
	// 	"country",
	// 	"website",
	// 	"manager_id"
	// );
	$columns = array();
	foreach($to_update as $key => $val)
	{	if($key != "manager_id")
		{
			$columns[] = `$key="$val"`;
		}
	}
	$query .= implode(",",$columns);
	$query .= " WHERE manager_id = " . $winery['manager_id'];

	
}
function deleteWinery($conn, $winery)
{
	
}

// $input = file_get_contents('php://input');

// $servername = "wheatley.cs.up.ac.za";
// $username = "u22512323";
// $password = "UFYT4LNTU7XNWZGY2NW7OR7FBYSBNNVW";

// $conn = new mysqli($servername, $username, $password);
// if ($conn->connect_error) {
// 	echo 'whoops';
// }
// $conn->query("USE u22512323_GrogBase;");

// getWineries($conn, $input);
?>