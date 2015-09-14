<?php namespace Dias\Modules\Projects\Http\Controllers;

use Dias\Project;
use Dias\Http\Controllers\Views\Controller;

class ProjectController extends Controller {

    /**
     * Shows the create project page.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('projects::create');
    }

    /**
     * Shows the project index page.
     * @param int $id project ID
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {
        $project = $this->requireNotNull(Project::find($id));
        $this->requireCanSee($project);

        return view('projects::index')
            ->withProject($project)
            ->withUser($this->user)
            ->with('isAdmin', $this->user->canAdminOneOfProjects([$id]));
    }
}
