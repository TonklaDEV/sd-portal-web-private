import { Component, OnInit } from "@angular/core";
import { AsideNavigationService } from "./services/aside-navigation/aside-navigation.service";
import { JwtHelperService } from "@auth0/angular-jwt";

@Component({
  selector: 'app-navigation-aside',
  templateUrl: './navigation-aside.component.html',
  styleUrls: ['./navigation-aside.component.scss'],
})
export class NavigationAsideComponent implements OnInit {
  protected openAsideNavigation: boolean = false;
  isAdmin = false;
  isApprover = false;
  isVicePresident = false;
  isPersonnel = false;
  isUser = false;
  isManager = false;
  isPresident = false;

  constructor(
    private readonly asideNavigationService: AsideNavigationService,
    private jwtService: JwtHelperService
  ) {
    this.asideNavigationService.$openAsideNavigation.subscribe(
      (openAsideNavigation: boolean) => {
        this.openAsideNavigation = openAsideNavigation;
      }
    );
  }

  ngOnInit(): void {
    // Perform this logic when the component initializes
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      // Decode the JWT token
      const decodedToken = this.jwtService.decodeToken(accessToken);
      const userRoles = decodedToken.role.map(
        (role: { authority: any }) => role.authority
      );

      // Check user roles
      this.isAdmin = userRoles.includes('ROLE_Admin');
      this.isApprover = userRoles.includes('ROLE_Approver');
      this.isVicePresident = userRoles.includes('ROLE_VicePresident');
      this.isPersonnel = userRoles.includes('ROLE_Personnel');
      this.isUser = userRoles.includes('ROLE_User');
      this.isManager = userRoles.includes('ROLE_Manager');
      this.isPresident = userRoles.includes('ROLE_President');
    }
  }

  protected onToggleAsideNavigation(): void {
    this.openAsideNavigation = !this.openAsideNavigation;
  }

  protected onCloseAsideNavigationToLink(): void {
    if (this.openAsideNavigation) {
      this.openAsideNavigation = false;
    }
  }
}
