<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>GolfLand - Admin Dashboard</title>

    <!-- Bootstrap Core CSS -->
    <link href="../public/GolfLandAdmin/js/bootstrap/css/bootstrap.min.css" rel="stylesheet">

    <!-- MetisMenu CSS -->
    <link href="../public/GolfLandAdmin/js/metisMenu/metisMenu.min.css" rel="stylesheet">

    <!-- Custom CSS -->
    <link href="../public/GolfLandAdmin/dist/css/sb-admin-2.css" rel="stylesheet">

    <!-- Morris Charts CSS -->
    <link href="../public/GolfLandAdmin/js/morrisjs/morris.css" rel="stylesheet">

    <!-- Custom Fonts -->
    <link href="../public/GolfLandAdmin/js/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="../public/GolfLandAdmin/css/common.css" rel="stylesheet">

</head>

<body>

    <div id="wrapper">

        <!-- Navigation -->
        <nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="golfAdmin">GolfLand Properties</a>
            </div>
            <!-- /.navbar-header -->

            <ul class="nav navbar-top-links navbar-right"> 	
                <li class="dropdown">
                    <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                        <i class="fa fa-user fa-fw"></i> <i class="fa fa-caret-down"></i>
                    </a>
                    <ul class="dropdown-menu dropdown-user">
                        <!-- <li><a href="#"><i class="fa fa-user fa-fw"></i> User Profile</a></li> -->
                        <!-- <li><a href="#"><i class="fa fa-gear fa-fw"></i> Settings</a></li> -->
                        <!-- <li class="divider"></li> -->
                        <li><a href="golfAdmin"><i class="fa fa-sign-out fa-fw"></i> Logout</a>
                        </li>
                    </ul>
                    <!-- /.dropdown-user -->
                </li>
                <!-- /.dropdown -->
            </ul>
            <!-- /.navbar-top-links -->

            <div class="navbar-default sidebar" role="navigation">
                <div class="sidebar-nav navbar-collapse">
                    <ul class="nav" id="side-menu">
                        <li class="sidemenu active">
                            <a href="GolfAdminHome"><i class="fa fa-dashboard fa-fw sidemenu active"></i> Dashboard</a>
                        </li>	
                    </ul>
                </div>
                <!-- /.sidebar-collapse -->
            </div>
            <!-- /.navbar-static-side -->
        </nav>

        <div id="page-wrapper">
            <div class="row">
                <div class="col-lg-12">
					<div class="panel panel-default">
                        <div class="panel-heading">
                            Add Properties
                        </div>
                        <div class="panel-body">
                            <ul class="nav nav-tabs">
                                <li class="active add_form_tab" data-tabtype="residential"><a href="#residentials" data-toggle="tab">Residentials</a></li>
                                <li class="add_form_tab" data-tabtype="comersial"><a href="#commercial" data-toggle="tab">Commercial</a></li>
                                <li class="add_form_tab" data-tabtype="warehouse"><a href="#warehouse" data-toggle="tab">Warehouses</a></li>
                                <li class="add_form_tab" data-tabtype="running"><a href="#runningoffice" data-toggle="tab">Running Office</a></li>
                            </ul>
                            <div class="tab-content">
                                <div class="tab-pane fade in active" id="residentials">
                                    <div class="col-lg-12" id="add_res_property_form"></div>
                                </div>
                                <div class="tab-pane fade in" id="commercial">
                                    <div class="col-lg-12" id="add_comm_property_form">Commersials Appartment Add Form.. <br>Commins Soon..</div>
                                </div>
                                <div class="tab-pane fade in" id="warehouse">
                                    <div class="col-lg-12" id="add_ware_property_form">Warehouse Add Fome.. <br>Commins Soon..</div>
                                </div>
                                <div class="tab-pane fade in" id="runningoffice">
                                    <div class="col-lg-12" id="add_run_property_form">Running Office Add Form.. <br>Commins Soon..</div>
                                </div>
                           </div>
                        </div>
                    </div>
                </div>
                <!-- /.col-lg-12 -->
            </div>
            <!-- /.row -->
            <!--<div class="row">
                <div class="col-lg-3 col-md-6">
                    <div class="panel panel-primary">
                        <div class="panel-heading">
                            <div class="row">
                                <div class="col-xs-3">
                                    <i class="fa fa-comments fa-5x"></i>
                                </div>
                                <div class="col-xs-9 text-right">
                                    <div class="huge">26</div>
                                    <div>New Comments!</div>
                                </div>
                            </div>
                        </div>
                        <a href="#">
                            <div class="panel-footer">
                                <span class="pull-left">View Details</span>
                                <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
                                <div class="clearfix"></div>
                            </div>
                        </a>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6">
                    <div class="panel panel-green">
                        <div class="panel-heading">
                            <div class="row">
                                <div class="col-xs-3">
                                    <i class="fa fa-tasks fa-5x"></i>
                                </div>
                                <div class="col-xs-9 text-right">
                                    <div class="huge">12</div>
                                    <div>New Tasks!</div>
                                </div>
                            </div>
                        </div>
                        <a href="#">
                            <div class="panel-footer">
                                <span class="pull-left">View Details</span>
                                <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
                                <div class="clearfix"></div>
                            </div>
                        </a>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6">
                    <div class="panel panel-yellow">
                        <div class="panel-heading">
                            <div class="row">
                                <div class="col-xs-3">
                                    <i class="fa fa-shopping-cart fa-5x"></i>
                                </div>
                                <div class="col-xs-9 text-right">
                                    <div class="huge">124</div>
                                    <div>New Orders!</div>
                                </div>
                            </div>
                        </div>
                        <a href="#">
                            <div class="panel-footer">
                                <span class="pull-left">View Details</span>
                                <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
                                <div class="clearfix"></div>
                            </div>
                        </a>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6">
                    <div class="panel panel-red">
                        <div class="panel-heading">
                            <div class="row">
                                <div class="col-xs-3">
                                    <i class="fa fa-support fa-5x"></i>
                                </div>
                                <div class="col-xs-9 text-right">
                                    <div class="huge">13</div>
                                    <div>Support Tickets!</div>
                                </div>
                            </div>
                        </div>
                        <a href="#">
                            <div class="panel-footer">
                                <span class="pull-left">View Details</span>
                                <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
                                <div class="clearfix"></div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <!-- /#page-wrapper -->

    </div>
    <!-- /#wrapper -->

    <!-- jQuery -->
    <script src="../public/GolfLandAdmin/js/jquery/jquery.min.js"></script>
	<script src="../public/GolfLandAdmin/js/jquery.toaster.js"></script>
	<script src="../public/GolfLandAdmin/js/dropzone.js"></script>
    <!-- Bootstrap Core JavaScript -->
    <script src="../public/GolfLandAdmin/js/bootstrap/js/bootstrap.min.js"></script>

    <!-- Metis Menu Plugin JavaScript -->
    <script src="../public/GolfLandAdmin/js/metisMenu/metisMenu.min.js"></script>

    <!-- Morris Charts JavaScript -->
    <script src="../public/GolfLandAdmin/js/raphael/raphael.min.js"></script>
    <script src="../public/GolfLandAdmin/js/morrisjs/morris.min.js"></script>
	
	<script src="../public/GolfLandAdmin/js/define.js"></script>
	<script src="../public/GolfLandAdmin/js/common.js"></script>
	<script src="../public/GolfLandAdmin/js/server.js"></script>
	<script src="../public/GolfLandAdmin/js/utils.js"></script>
	<script src="../public/GolfLandAdmin/js/reports/home.js"></script>
	<script src="../public/GolfLandAdmin/js/reports/recidentials.js"></script>
	<script src="../public/GolfLandAdmin/js/reports/commercial.js"></script>
	<script>
		function initMap() {
			var input = document.getElementById("google_city");
			var options = {lat:23.424076,lng:53.847818};
			var options = {
					  bounds: [{lat:23.424076,lng:53.847818}],
					  types: ['geocode']
					};
			var autocomplete = new google.maps.places.Autocomplete(input);
			autocomplete.addListener('place_changed', function() {
				var place = autocomplete.getPlace();
				$("#latt").val(place.geometry.location.lat());
				$("#long").val(place.geometry.location.lng());
			})
		}
	</script>
	<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA-8RDmgpFYHBKnwvvhSxs6-7qOF_VF5TA&libraries=places&callback=initMap" async defer></script>
	
</body>

</html>
