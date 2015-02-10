# ngRibbon

A Ribbon component using AngularJS.

Examples:
https://github.com/OkGoDoIt/Office-Ribbon-2010

## Design Notes

Tabs are registered with the TabRegister provider.

	interface TabItem {
		name: string;
		/**
		 * Can be a number or 'last'.
		 */
		order: number | string;
		templateUrl: string;
		contextual?: {
			group: string;
			color: string;
		}
	}

	type Deactivate = () => void;

	interface TabService {
		setContext(tabName: string; context: any): void;
		activateContextual(groupName: string, context: any): Deactivate;
	}

Backstage content should be reusable in a welcome screen. There should be a directive for the content (menu and details), which will be used by a backstage and welcome screen directive, each of which will indicate context.

Each action is a directive that can handle itself: layout, linebreaks.

## Features:

1. Tabs
2. Backstage
	1. Backstage Menu
	1. Backstage Content
	1. Slide in animation
	1. Slide out animation
3. Title Bar
4. Quick Access Toolbar
4. Collapsible
    1. Slide down animation
    1. Handle double clicks on tabs
    1. Handle click outside ribbon (don't collapse on all clicks)
4. Responsive
5. Contextual Tabs
    1. Support groups
    1. Multiple tabs in contextual group
    1. Group title affects Document title position
6. User Settings
7. Actions
	1. Large Button
	1. Small Button (vNext)
	1. Button Group (vNext)
	1. Drop Button - Custom Content
	2. Split Button - Custom Content
	3. Separator (vNext)
	4. Gallery (vNext)
8. Commands
	1. Contextual Commands
9. Declarative
1. API
