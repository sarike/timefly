import os
from config.settings import PROJECT_PATH

__author__ = 'Sarike'

JS_ROOT = os.path.join(PROJECT_PATH, 'static/js')
SPM_BUILD_COMMAND = 'spm build'
SPM_INSTALL_COMMAND = 'spm install .'


def change_dir(dir_path):
    print 'change dir to ', dir
    os.chdir(dir_path)


def exec_cmd(cmd):
    print 'executing cmd: ', cmd
    os.system(cmd)


def package_js(pkg_path):
    """
    pkg_path: related to 'static'
    """
    common_home = os.path.join(JS_ROOT, pkg_path)
    change_dir(common_home)
    exec_cmd(SPM_BUILD_COMMAND)
    exec_cmd(SPM_INSTALL_COMMAND)